import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const QnATextArea = ({field, form, ...props } : any) => {

  const editorRef : any = useRef(null);

  return (<>
    <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE}
        // onInit={(evt, editor) => editorRef.current = editor}
        {...field}
        {...props}
        onEditorChange={(e) => {
          form.handleChange({ target: { name: 'answer', value: e } })
        }}
        initialValue={field.value}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </>) 
};

