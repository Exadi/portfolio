import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

/*
This component exists simply to apply the same basic settings to all 
uses of the editor
*/

function MyTextEditor(props) {
  const { user } = useSelector((state) => state.auth);
  const editorRef = useRef(null);

  return (
    <Editor
      tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={props.value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "preview",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help | image | viewsource",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        images_upload_url: `/uploadImage/${user.id}`,
        relative_urls: false,
      }}
      onEditorChange={() => {
        console.log("onChange");
        if (props.onChange.length === 1) {
          props.onChange(editorRef.current.getContent());
        } else if (props.onChange.length === 2) {
          props.onChange(props.index, editorRef.current.getContent());
        }
      }}
    />
  );
}

export default MyTextEditor;
