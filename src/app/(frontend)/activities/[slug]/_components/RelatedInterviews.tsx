import Link from 'next/link'
import Image from 'next/image'
import { Mic } from 'lucide-react'

type Interview = {
  id: string
  slug: string
  title: string
  main_image_url: string | null
}

type Props = {
  interviews: Interview[]
}

export function RelatedInterviews({ interviews }: Props) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Mic className="h-5 w-5 text-primary" />
        関連インタビュー
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {interviews.map((interview) => (
          <Link
            key={interview.id}
            href={`/interviews/${interview.slug}`}
            className="group block"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-2">
              {interview.main_image_url ? (
                <Image
                  src={interview.main_image_url}
                  alt={interview.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Mic className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {interview.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
