// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { extractText } from 'office-text-extractor'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const readFile = async() => {
    const html = await extractText('/doc/completed.docx')
    console.log(html)

    }
    readFile()
  res.status(200).json({ name: 'John Doe' })
}
