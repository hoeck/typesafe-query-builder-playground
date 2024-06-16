import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.module.css';
const anySelf = self;
anySelf.monaco = monaco;
export const Editor = () => {
    const [editor, setEditor] = useState(null);
    const monacoEl = useRef(null);
    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor)
                    return editor;
                return monaco.editor.create(monacoEl.current, {
                    value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                    language: 'typescript'
                });
            });
        }
        return () => editor?.dispose();
    }, [monacoEl.current]);
    return _jsx("div", { className: styles.Editor, ref: monacoEl });
};
