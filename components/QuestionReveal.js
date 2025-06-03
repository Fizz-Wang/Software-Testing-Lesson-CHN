// components/QuestionReveal.js
import React, { useState } from 'react';
import styles from '../styles/QuestionReveal.module.css'; // 我们稍后会创建这个 CSS 文件

export default function QuestionReveal({ questionData }) {
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

    const toggleAnswer = () => {
        setIsAnswerVisible(!isAnswerVisible);
    };

    if (!questionData) {
        return null; // 如果没有题目数据，则不渲染任何内容
    }

    // Helper function to render text that might contain newlines as HTML
    const renderWithLineBreaks = (text) => {
        if (!text) return null;
        // Replace newline characters with <br /> tags for HTML rendering
        return text.split('\n').map((line, index, array) => (
            <React.Fragment key={index}>
                {line}
                {index < array.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className={styles.questionContainer}>
            {/* 题目类型和文本 */}
            <div className={styles.questionHeader}>
                {questionData.type === 'multiple-choice' && <span className={styles.questionType}>选择题</span>}
                {questionData.type === 'short-answer' && <span className={styles.questionType}>简答题</span>}
                {/* 题目文本现在直接作为文本渲染，如果需要HTML，可以使用 dangerouslySetInnerHTML，但要注意XSS风险 */}
                <p className={styles.questionText}>{questionData.questionText}</p>
            </div>

            {/* 选择题选项 (仅展示) */}
            {questionData.type === 'multiple-choice' && questionData.options && (
                <ul className={styles.optionsList}>
                    {questionData.options.map((option, index) => (
                        // 确保 option 本身是字符串，或者 option.text 是字符串
                        <li key={option.id || index}>{typeof option === 'string' ? option : option.text}</li>
                    ))}
                </ul>
            )}

            {/* 显示/隐藏答案按钮 */}
            <button onClick={toggleAnswer} className={styles.toggleButton}>
                {isAnswerVisible ? '隐藏答案' : '显示答案'}
            </button>

            {/* 答案区域 */}
            {isAnswerVisible && (
                <div className={styles.answerSection}>
                    {questionData.type === 'multiple-choice' && (
                        <>
                            <p><strong>正确答案：</strong> {questionData.correctOptionText || questionData.options?.find(opt => opt.id === questionData.correctOptionId)?.text}</p>
                            {questionData.explanation && (
                                <p>
                                    <strong>解析：</strong><br />
                                    {renderWithLineBreaks(questionData.explanation)}
                                </p>
                            )}
                        </>
                    )}
                    {questionData.type === 'short-answer' && questionData.modelAnswer && (
                        <p>
                            <strong>参考答案：</strong><br />
                            {renderWithLineBreaks(questionData.modelAnswer)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}