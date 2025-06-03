// pages/study-materials/basic-testing/[lessonSlug].js
import StudyMaterialsLayout from '../../../components/StudyMaterialsLayout'; // 路径可能需要调整
import LessonSidebar from '../../../components/LessonSidebar'; // 路径可能需要调整
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../../styles/LessonContent.module.css'; // 路径可能需要调整
import path from 'path'; // 用于Node.js路径操作
import fs from 'fs'; // 用于Node.js文件系统操作
import matter from 'gray-matter'; // 用于解析MDX/Markdown frontmatter
import { serialize } from 'next-mdx-remote/serialize'; // 用于将MDX字符串序列化为可渲染格式
import { MDXRemote } from 'next-mdx-remote'; // 用于渲染序列化后的MDX
import QuestionReveal from '../../../components/QuestionReveal';

const lessonsMeta = [

    { slug: 'TBD', title: 'TBD', fileName: 'TBD.mdx', quizFile: 'TBD.json' },
    // { slug: 'testing-psychology', title: '1.3 测试心理学', fileName: '03-testing-psychology.mdx', quizFile: 'quiz03.json' },
];

const components = {
    // QuestionReveal, // 如果在MDX中直接使用<QuestionReveal />则需要，现在我们不在MDX中直接用它渲染整个quiz
    h3: (props) => <h3 className={styles.subheading} {...props} />,
    hr: (props) => <hr className={styles.divider} {...props} />,
};
// pages/study-materials/basic-testing/[lessonSlug].js (继续)

export default function LessonPage({ lessonContent, currentLessonMeta, quizData }) {
    if (!currentLessonMeta) { // currentLessonMeta 应该总是有值，因为 fallback: false
        return <p>课程信息加载中...</p>;
    }

    return (
        <>
            <Head>
                <title>{currentLessonMeta.title} - 基础测试 - SoftwareTestingLearn</title>
            </Head>
            <StudyMaterialsLayout
                activeSubNav="basic-testing"
                lessonSidebar={<LessonSidebar lessons={lessonsMeta} basePath="/study-materials/automated-testing" />}
            >
                <article className={styles.lessonArticle}>
                    <h1 className={styles.lessonTitle}>{currentLessonMeta.title}</h1>
                    {lessonContent.mdxSource ? (
                        <MDXRemote {...lessonContent.mdxSource} components={components} />
                    ) : (
                        <p>课程内容加载失败...</p>
                    )}

                    {/* 在这里渲染测验 */}
                    {quizData && quizData.questions && quizData.questions.length > 0 && (
                        <div className="quiz-section-container" style={{ marginTop: '50px', paddingTop:'30px', borderTop: '1px solid #eee' }}>
                            <h2>{quizData.title || '单元练习'}</h2>
                            {quizData.questions.map((question, index) => (
                                <QuestionReveal key={question.id || index} questionData={question} />
                            ))}
                        </div>
                    )}
                </article>
            </StudyMaterialsLayout>
        </>
    );
}

// Next.js 数据获取函数

// getStaticPaths 用于定义哪些动态路径需要预渲染
export async function getStaticPaths() {
    const paths = lessonsMeta.map(lesson => ({
        params: { lessonSlug: lesson.slug },
    }));
    return { paths, fallback: false }; // fallback: false 表示未知路径返回404
}
// pages/study-materials/basic-testing/[lessonSlug].js (继续)

export async function getStaticProps({ params }) {
    const { lessonSlug } = params;
    const currentLessonMeta = lessonsMeta.find(lesson => lesson.slug === lessonSlug);

    if (!currentLessonMeta) {
        return { notFound: true };
    }

    const postsDirectory = path.join(process.cwd(), 'data', 'study-materials', 'automated-testing');

    // 1. 读取 MDX 课程内容
    const mdxFullPath = path.join(postsDirectory, currentLessonMeta.fileName);
    let lessonContent = { frontmatter: {}, mdxSource: null }; // 默认值
    try {
        const fileContents = fs.readFileSync(mdxFullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const mdxSource = await serialize(content, { parseFrontmatter: true });
        lessonContent = { frontmatter: data, mdxSource };
    } catch (error) {
        console.error(`Error reading MDX file ${currentLessonMeta.fileName}:`, error);
        // 如果MDX文件读取失败，可以决定是否返回 notFound: true 或继续（可能只显示测验）
    }

    // 2. 读取 Quiz JSON 数据
    let quizData = null;
    if (currentLessonMeta.quizFile) {
        const quizFilePath = path.join(postsDirectory, currentLessonMeta.quizFile);
        try {
            const quizFileContent = fs.readFileSync(quizFilePath, 'utf8');
            quizData = JSON.parse(quizFileContent);
        } catch (error) {
            console.error(`Error reading Quiz JSON file ${currentLessonMeta.quizFile}:`, error);
            // 如果 Quiz JSON 文件读取失败，quizData 将保持为 null
        }
    }

    return {
        props: {
            lessonContent,
            currentLessonMeta,
            quizData, // 将 quizData 作为 prop 传递给页面组件
        },
    };
}
