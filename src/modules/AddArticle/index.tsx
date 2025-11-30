import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { generateArticleId } from "../../utils/ArticlesLocalStorage";
import { calculateReadTime } from "../../utils/calculateReadTime";
import { withAuth } from "../../HOCs/withAuth";
import { addArticle } from "../../store/slices/articlesSlice";
import { compressBase64Image, getImageSizeInKB } from "../../utils/imageUtils";
import "./style.scss";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold as BoldIcon,
  Braces as BracesIcon,
  Indent as IndentIcon,
  Italic as ItalicIcon,
  List as BulletListIcon,
  ListOrdered as OrderedListIcon,
  Outdent as OutdentIcon,
  Strikethrough as StrikethroughIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
} from "lucide-react";
import { selectCurrentUser } from "../../store/selectors/authSelector";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const AddArticle: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const { loading } = useAppSelector((state) => state.articles);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [savedHtml, setSavedHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      CodeBlock,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "embedded-image",
        },
        allowBase64: true,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setSavedHtml(editor.getHTML());
    },
    editorProps: {
      // md shortcuts for headings
      transformPastedText(text) {
        return text
          .replace(/^### (.*$)/gim, "<h3>$1</h3>")
          .replace(/^## (.*$)/gim, "<h2>$1</h2>")
          .replace(/^# (.*$)/gim, "<h1>$1</h1>");
      },
      handleKeyDown: (view, event) => {
        if (event.ctrlKey || event.metaKey) {
          switch (event.key) {
            case "1":
              event.preventDefault();
              editor?.chain().focus().toggleHeading({ level: 1 }).run();
              return true;
            case "2":
              event.preventDefault();
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
              return true;
            case "3":
              event.preventDefault();
              editor?.chain().focus().toggleHeading({ level: 3 }).run();
              return true;
            case "0":
              event.preventDefault();
              editor?.chain().focus().setParagraph().run();
              return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);

        const imageItem = items.find((item) => item.type.startsWith("image"));

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              const base64 = readerEvent.target?.result;
              if (base64) {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({
                      src: base64,
                    }),
                  ),
                );
              }
            };
            reader.readAsDataURL(file);
          }
          return true;
        }
        return false;
      },
      handleDrop: (view, event) => {
        const items = Array.from(event.dataTransfer?.items || []);

        const imageItem = items.find((item) => item.type.startsWith("image"));

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              const base64 = readerEvent.target?.result;
              if (base64) {
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                if (coordinates) {
                  view.dispatch(
                    view.state.tr.insert(
                      coordinates.pos,
                      view.state.schema.nodes.image.create({
                        src: base64,
                      }),
                    ),
                  );
                }
              }
            };
            reader.readAsDataURL(file);
          }
          return true;
        }
        return false;
      },
    },
  });

  const wordCount = useMemo(() => {
    if (!editor) return 0;
    const txt = editor.state.doc.textContent || "";
    const trimmed = txt.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [editor, editor?.state.doc]);

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
  const toggleSuperscript = () =>
    editor?.chain().focus().toggleSuperscript().run();
  const toggleSubscript = () => editor?.chain().focus().toggleSubscript().run();
  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrdered = () => editor?.chain().focus().toggleOrderedList().run();

  const indent = () => {
    editor?.chain().focus().sinkListItem("listItem").run();
  };

  const outdent = () => {
    editor?.chain().focus().liftListItem("listItem").run();
  };

  const setAlign = (align: "left" | "center" | "right" | "justify") => {
    editor?.chain().focus().setTextAlign(align).run();
  };

  const isAlignActive = (align: string) => {
    return editor?.isActive({ textAlign: align }) || false;
  };

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !editor || !editor.state.doc.textContent.trim()) {
      return;
    }

    try {
      let html = editor.getHTML();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const images = tempDiv.querySelectorAll('img[src^="data:image/"]');

      for (const img of Array.from(images)) {
        const src = img.getAttribute("src");
        if (src) {
          const sizeKB = getImageSizeInKB(src);
          if (sizeKB > 500) {
            try {
              const compressedSrc = await compressBase64Image(src, 800, 0.7);
              img.setAttribute("src", compressedSrc);
            } catch (error) {
              console.warn("Failed to compress image:", error);
            }
          }
        }
      }

      html = tempDiv.innerHTML;

      const article = {
        id: generateArticleId(),
        title: title.trim(),
        category: category.trim() || "General",
        content: html,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readTime: calculateReadTime(editor.state.doc.textContent || ""),
        views: 0,
      };

      dispatch(addArticle(article));

      setTitle("");
      setCategory("");
      editor.commands.clearContent(true);
      navigate("/my-articles");
    } catch (err) {
      console.error("Error saving article:", err);
    }
  };

  return (
    <div className="add-article-content">
      <h1 className="add-article-title">Add Article</h1>

      <form onSubmit={handleSubmit} className="article-form">
        <div
          className="formatting-toolbar"
          role="toolbar"
          aria-label="Formatting toolbar"
        >
          <div className="toolbar-left">
            <button
              type="button"
              onClick={toggleBold}
              className={editor?.isActive("bold") ? "active" : ""}
              title="Bold"
            >
              <BoldIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleItalic}
              className={editor?.isActive("italic") ? "active" : ""}
              title="Italic"
            >
              <ItalicIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleUnderline}
              className={editor?.isActive("underline") ? "active" : ""}
              title="Underline"
            >
              <UnderlineIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleStrike}
              className={editor?.isActive("strike") ? "active" : ""}
              title="Strikethrough"
            >
              <StrikethroughIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleCodeBlock}
              className={editor?.isActive("codeBlock") ? "active" : ""}
              title="Code block"
            >
              <BracesIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleSuperscript}
              className={editor?.isActive("superscript") ? "active" : ""}
              title="Superscript"
            >
              <SuperscriptIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleSubscript}
              className={editor?.isActive("subscript") ? "active" : ""}
              title="Subscript"
            >
              <SubscriptIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleBullet}
              className={editor?.isActive("bulletList") ? "active" : ""}
              title="Bulleted list"
            >
              <BulletListIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggleOrdered}
              className={editor?.isActive("orderedList") ? "active" : ""}
              title="Numbered list"
            >
              <OrderedListIcon size={18} />
            </button>

            <button type="button" onClick={indent} title="Indent">
              <IndentIcon size={18} />
            </button>

            <button type="button" onClick={outdent} title="Outdent">
              <OutdentIcon size={18} />
            </button>
          </div>

          <div className="toolbar-right">
            <button
              type="button"
              onClick={() => setAlign("left")}
              className={isAlignActive("left") ? "active" : ""}
              title="Align left"
            >
              <AlignLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setAlign("center")}
              className={isAlignActive("center") ? "active" : ""}
              title="Align center"
            >
              <AlignCenter size={18} />
            </button>

            <button
              type="button"
              onClick={() => setAlign("right")}
              className={isAlignActive("right") ? "active" : ""}
              title="Align right"
            >
              <AlignRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setAlign("justify")}
              className={isAlignActive("justify") ? "active" : ""}
              title="Justify"
            >
              <AlignJustify size={18} />
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          className="title-input"
          required
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category..."
          className="category-input"
        />

        <div className="editor-container">
          <EditorContent editor={editor} className="content-editor" />
          <div className="word-count">Words: {wordCount}</div>
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || wordCount === 0}
          className="publish-button"
        >
          {loading ? "Publishing..." : "Publish an article"}
        </button>
      </form>
    </div>
  );
};

export default withAuth(AddArticle);
