import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import path from 'path'

const BUCKETS = {
  avatars: {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  events: {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
} as const

type BucketName = keyof typeof BUCKETS

async function ensureBucket(admin: ReturnType<typeof createAdminClient>, name: BucketName) {
  const { data: buckets, error: listError } = await admin.storage.listBuckets()
  if (listError) throw new Error(`Gagal cek bucket: ${listError.message}`)

  const exists = buckets?.some((b) => b.name === name)
  if (!exists) {
    const config = BUCKETS[name]
    const { error: createError } = await admin.storage.createBucket(name, config)
    if (createError) throw new Error(`Gagal buat bucket "${name}": ${createError.message}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string || 'avatars') as BucketName

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!(bucket in BUCKETS)) {
      return NextResponse.json({ error: `Bucket "${bucket}" tidak valid` }, { status: 400 })
    }

    const config = BUCKETS[bucket]
    if (file.size > config.fileSizeLimit) {
      const maxMB = config.fileSizeLimit / (1024 * 1024)
      return NextResponse.json({ error: `Ukuran file maksimal ${maxMB}MB` }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await ensureBucket(supabaseAdmin, bucket)

    const ext = path.extname(file.name) || '.jpg'
    const filePath = `${user.id}/${Date.now()}${ext}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
