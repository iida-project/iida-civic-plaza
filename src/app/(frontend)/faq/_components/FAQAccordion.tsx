'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { RichTextRenderer } from '@/components/common'

type FAQ = {
  id: string
  question: string
  answer: string
  sort_order: number
}

type Props = {
  faqs: FAQ[]
}

export function FAQAccordion({ faqs }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <AccordionItem
              value={faq.id}
              className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                    Q
                  </span>
                  <span className="font-semibold pt-1">{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="flex items-start gap-3 pl-0">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-apple-green/10 text-apple-green font-bold flex items-center justify-center text-sm">
                    A
                  </span>
                  <div className="pt-1 flex-1">
                    <RichTextRenderer html={faq.answer} size="small" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  )
}
