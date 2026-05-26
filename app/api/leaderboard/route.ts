import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Check if we need to reset (on 1st of month)
  const lastAchievement = await prisma.achievement.findFirst({
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  })

  if (now.getDate() === 1) {
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear

    if (!lastAchievement || lastAchievement.month !== lastMonth || lastAchievement.year !== lastYear) {
      // Get top 5 from last month
      const topScores = await prisma.score.findMany({
        where: {
          completedAt: {
            gte: new Date(lastYear, lastMonth - 1, 1),
            lt: new Date(lastYear, lastMonth, 1),
          },
        },
        include: { user: { select: { id: true } } },
        orderBy: { score: 'desc' },
      })

      const userScores = new Map<number, number>()
      for (const s of topScores) {
        userScores.set(s.userId, (userScores.get(s.userId) || 0) + s.score)
      }

      const sorted = Array.from(userScores.entries()).sort((a, b) => b[1] - a[1])
      const top5 = sorted.slice(0, 5)

      for (let i = 0; i < top5.length; i++) {
        await prisma.achievement.upsert({
          where: {
            userId_month_year: {
              userId: top5[i][0],
              month: lastMonth,
              year: lastYear,
            },
          },
          update: { position: i + 1 },
          create: {
            userId: top5[i][0],
            month: lastMonth,
            year: lastYear,
            position: i + 1,
          },
        })
      }
    }
  }

  // Get current month leaderboard
  const scores = await prisma.score.findMany({
    where: {
      completedAt: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
    include: {
      user: {
        select: { id: true, name: true, tiktokName: true, profilePhoto: true },
      },
    },
    orderBy: { score: 'desc' },
  })

  const leaderboard = new Map<number, { user: typeof scores[0]['user']; totalScore: number }>()
  for (const s of scores) {
    const existing = leaderboard.get(s.userId)
    if (existing) {
      existing.totalScore += s.score
    } else {
      leaderboard.set(s.userId, { user: s.user, totalScore: s.score })
    }
  }

  const sorted = Array.from(leaderboard.values()).sort((a, b) => b.totalScore - a.totalScore)
  return NextResponse.json(sorted)
}
