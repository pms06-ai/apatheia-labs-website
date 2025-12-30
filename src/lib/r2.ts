import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

// Mock storage path for local development
const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'tmp', 'uploads')

// Check if we have valid R2 credentials
const HAS_R2_CREDS =
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCOUNT_ID !== 'placeholder-account-id' &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY

// Initialize R2 client only if creds are valid
const r2Client = HAS_R2_CREDS ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
}) : null

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'local-bucket'

/**
 * Generate a unique storage path for a document
 */
export function generateStoragePath(caseId: string, filename: string): string {
  const timestamp = Date.now()
  const hash = crypto.randomBytes(8).toString('hex')
  const ext = filename.split('.').pop()
  return `cases/${caseId}/${timestamp}-${hash}.${ext}`
}

/**
 * Calculate SHA-256 hash of file content
 */
export function calculateHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Ensure local storage directory exists
 */
async function ensureLocalDir(storagePath: string) {
  const fullPath = path.join(LOCAL_STORAGE_DIR, storagePath)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  return fullPath
}

/**
 * Upload a document to R2 or Local Storage
 */
export async function uploadDocument(
  buffer: Buffer,
  storagePath: string,
  contentType: string
): Promise<{ storagePath: string; hash: string; size: number }> {
  const hash = calculateHash(buffer)

  if (r2Client) {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storagePath,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          'sha256-hash': hash,
          'upload-date': new Date().toISOString(),
        },
      })
    )
  } else {
    // Local fallback
    const fullPath = await ensureLocalDir(storagePath)
    await fs.writeFile(fullPath, buffer)
    console.log(`[MOCK R2] Saved file to ${fullPath}`)
  }

  return {
    storagePath,
    hash,
    size: buffer.length,
  }
}

/**
 * Get a signed URL for downloading a document
 */
export async function getDownloadUrl(storagePath: string, expiresIn = 3600): Promise<string> {
  if (r2Client) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: storagePath,
    })
    return getSignedUrl(r2Client, command, { expiresIn })
  }

  // Local fallback - fake URL (would need a route to serve this in real app, but ok for now)
  return `/api/documents/download?path=${encodeURIComponent(storagePath)}`
}

/**
 * Get a signed URL for uploading a document (direct upload from browser)
 */
export async function getUploadUrl(
  storagePath: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  if (r2Client) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: storagePath,
      ContentType: contentType,
    })
    return getSignedUrl(r2Client, command, { expiresIn })
  }

  return `/api/documents/upload-mock?path=${encodeURIComponent(storagePath)}`
}

/**
 * Download document content
 */
export async function downloadDocument(storagePath: string): Promise<Buffer> {
  if (r2Client) {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storagePath,
      })
    )

    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  }

  // Local fallback
  const fullPath = path.join(LOCAL_STORAGE_DIR, storagePath)
  return fs.readFile(fullPath)
}

/**
 * Delete a document from R2
 */
export async function deleteDocument(storagePath: string): Promise<void> {
  if (r2Client) {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storagePath,
      })
    )
  } else {
    // Local fallback
    const fullPath = path.join(LOCAL_STORAGE_DIR, storagePath)
    await fs.unlink(fullPath).catch(() => { })
  }
}

/**
 * Get public URL for a document (if bucket is public)
 */
export function getPublicUrl(storagePath: string): string {
  if (process.env.R2_PUBLIC_URL && process.env.R2_PUBLIC_URL !== 'https://placeholder-bucket.r2.dev') {
    return `${process.env.R2_PUBLIC_URL}/${storagePath}`
  }
  return `/api/documents/view?path=${encodeURIComponent(storagePath)}`
}
