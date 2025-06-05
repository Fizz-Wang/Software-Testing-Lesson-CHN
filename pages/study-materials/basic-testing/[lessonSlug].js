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
import Link from 'next/link'; // 确保 Link 已导入

const lessonsMeta = [
    { slug: 'what-is-testing', title: '1.1 什么是测试？', fileName: '1-1-0-what-is-testing.mdx', quizFile: 'quiz-1-1-0.json' }, // 添加 quizFile
        { slug: '1-1-1', title: '1.1.1 测试目标', fileName: '1-1-1-Test Objectives.mdx', quizFile: 'quiz-1-1-1.json' },
        { slug: '1-1-2', title: '1.1.2 测试与调试', fileName: '1-1-2-Testing and Debugging.mdx', quizFile: 'quiz-1-1-2.json' },
        { slug: '1-2-0', title: '1.2 为什么测试是必要的？', fileName: '1-2-0-Why is Testing Necessary.mdx', quizFile: 'quiz-1-2-0.json' },
        { slug: '1-2-1', title: '1.2.1 测试对成功的贡献', fileName: '1-2-1-Testing’s Contributions to Success.mdx', quizFile: 'quiz-1-2-1.json' },
        { slug: '1-2-2', title: '1.2.2 测试与质量保证 (QA)', fileName: '1-2-2-Testing and Quality Assurance (QA).mdx', quizFile: 'quiz-1-2-2.json' },
        { slug: '1-2-3', title: '1.2.3 错误、缺陷、故障和根本原因', fileName: '1-2-3-Errors, Defects, Failures, and Root Causes.mdx', quizFile: 'quiz-1-2-3.json' },
        { slug: '1-3-0', title: '1.3 测试原则', fileName: '1-3-0-Testing Principles.mdx', quizFile: 'quiz-1-3-0.json' },
        { slug: '1-4-0', title: '1.4 测试活动、测试件和测试角色', fileName: '1-4-0-Test Activities, Testware and Test Roles.mdx', quizFile: 'quiz-1-4-0.json' },
        { slug: '1-4-1', title: '1.4.1 测试活动和任务', fileName: '1-4-1-Test Activities and Tasks.mdx', quizFile: 'quiz-1-4-1.json' },
        { slug: '1-4-2', title: '1.4.2 情境中的测试过程', fileName: '1-4-2-Test Process in Context.mdx', quizFile: 'quiz-1-4-2.json' },
        { slug: '1-4-3', title: '1.4.3 测试件', fileName: '1-4-3-Testware.mdx', quizFile: 'quiz-1-4-3.json' },
        { slug: '1-4-4', title: '1.4.4 测试依据和测试件之间的可追溯性', fileName: '1-4-4-Traceability between the Test Basis and Testware.mdx', quizFile: 'quiz-1-4-4.json' },
        { slug: '1-4-5', title: '1.4.5 测试中的角色', fileName: '1-4-5-Roles in Testing.mdx', quizFile: 'quiz-1-4-5.json' },
        { slug: '1-5-0', title: '1.5 测试中的基本技能和良好实践', fileName: '1-5-0-Essential Skills and Good Practices in Testing.mdx', quizFile: 'quiz-1-5-0.json' },
        { slug: '1-5-1', title: '1.5.1 测试所需通用技能', fileName: '1-5-1-Generic Skills Required for Testing.mdx', quizFile: 'quiz-1-5-1.json' },
        { slug: '1-5-2', title: '1.5.2 团队整体方法', fileName: '1-5-2-Whole Team Approach.mdx', quizFile: 'quiz-1-5-2.json' },
        { slug: '1-5-3', title: '1.5.3 测试的独立性', fileName: '1-5-3-Independence of Testing.mdx', quizFile: 'quiz-1-5-3.json' },
        { slug: '2-1-0', title: '2.1 软件开发生命周期 (SDLC) 背景下的测试', fileName: '2-1-0-Testing in the Context of a Software Development Lifecycle (SDLC).mdx', quizFile: 'quiz-2-1-0.json' },
        { slug: '2-1-1', title: '2.1.1 软件开发生命周期对测试的影响', fileName: '2-1-1-Impact of the Software Development Lifecycle on Testing.mdx', quizFile: 'quiz-2-1-1.json' },
        { slug: '2-1-2', title: '2.1.2 软件开发生命周期和良好测试实践', fileName: '2-1-2-Software Development Lifecycle and Good Testing Practices.mdx', quizFile: 'quiz-2-1-2.json' },
        { slug: '2-1-3', title: '2.1.3 测试作为软件开发的驱动力', fileName: '2-1-3-Testing as a Driver for Software Development.mdx', quizFile: 'quiz-2-1-3.json' },
        { slug: '2-1-4', title: '2.1.4 DevOps 和测试', fileName: '2-1-4-DevOps and Testing.mdx', quizFile: 'quiz-2-1-4.json' },
        { slug: '2-1-5', title: '2.1.5 测试左移', fileName: '2-1-5-Shift Left.mdx', quizFile: 'quiz-2-1-5.json' },
        { slug: '2-1-6', title: '2.1.6 回顾和过程改进', fileName: '2-1-6-Retrospectives and Process Improvement.mdx', quizFile: 'quiz-2-1-6.json' },
        { slug: '2-2-0', title: '2.2 测试级别和测试类型', fileName: '2-2-0-Test Levels and Test Types.mdx', quizFile: 'quiz-2-2-0.json' },
        { slug: '2-2-1', title: '2.2.1 测试级别', fileName: '2-2-1-Test Levels.mdx', quizFile: 'quiz-2-2-1.json' },
        { slug: '2-2-2', title: '2.2.2 测试类型', fileName: '2-2-2-Test Types.mdx', quizFile: 'quiz-2-2-2.json' },
        { slug: '2-2-3', title: '2.2.3 确认测试和回归测试', fileName: '2-2-3-Confirmation Testing and Regression Testing.mdx', quizFile: 'quiz-2-2-3.json' },
        { slug: '2-3-0', title: '2.3 维护测试', fileName: '2-3-0-Maintenance Testing.mdx', quizFile: 'quiz-2-3-0.json' },
        { slug: '3-1-0', title: '3.1 静态测试基础', fileName: '3-1-0-Static Testing Basics.mdx', quizFile: 'quiz-3-1-0.json' },
        { slug: '3-1-1', title: '3.1.1 静态测试可审查的工作产品', fileName: '3-1-1-Work Products Examinable by Static Testing.mdx', quizFile: 'quiz-3-1-1.json' },
        { slug: '3-1-2', title: '3.1.2 静态测试的价值', fileName: '3-1-2-Value of Static Testing.mdx', quizFile: 'quiz-3-1-2.json' },
        { slug: '3-1-3', title: '3.1.3 静态测试与动态测试的区别', fileName: '3-1-3-Differences between Static Testing and Dynamic Testing.mdx', quizFile: 'quiz-3-1-3.json' },
        { slug: '3-2-1', title: '3.2.1 早期和频繁的干系人反馈的好处', fileName: '3-2-1-Benefits of Early and Frequent Stakeholder Feedback.mdx', quizFile: 'quiz-3-2-1.json' },
        { slug: '3-2-2', title: '3.2.2 评审过程活动', fileName: '3-2-2-Review Process Activities.mdx', quizFile: 'quiz-3-2-2.json' },
        { slug: '3-2-3', title: '3.2.3 评审中的角色和职责', fileName: '3-2-3-Roles and Responsibilities in Reviews.mdx', quizFile: 'quiz-3-2-3.json' },
        { slug: '3-2-4', title: '3.2.4 评审类型', fileName: '3-2-4-Review Types.mdx', quizFile: 'quiz-3-2-4.json' },
        { slug: '3-2-5', title: '3.2.5 评审的成功因素', fileName: '3-2-5-Success Factors for Reviews.mdx', quizFile: 'quiz-3-2-5.json' },
        { slug: '4-1-0', title: '4.1 测试技术概述', fileName: '4-1-0-Test Techniques Overview.mdx', quizFile: 'quiz-4-1-0.json' },
        { slug: '4-2-0', title: '4.2 黑盒测试技术', fileName: '4-2-0-Black-Box Test Techniques.mdx', quizFile: 'quiz-4-2-0.json' },
        { slug: '4-2-1', title: '4.2.1 等价划分', fileName: '4-2-1-Equivalence Partitioning.mdx', quizFile: 'quiz-4-2-1.json' },
        { slug: '4-2-2', title: '4.2.2 边界值分析', fileName: '4-2-2-Boundary Value Analysis.mdx', quizFile: 'quiz-4-2-2.json' },
        { slug: '4-2-3', title: '4.2.3 决策表测试', fileName: '4-2-3-Decision Table Testing.mdx', quizFile: 'quiz-4-2-3.json' },
        { slug: '4-2-4', title: '4.2.4 状态转换测试', fileName: '4-2-4-State Transition Testing.mdx', quizFile: 'quiz-4-2-4.json' },
        { slug: '4-3-0', title: '4.3 白盒测试技术', fileName: '4-3-0-White-Box Test Techniques.mdx', quizFile: 'quiz-4-3-0.json' },
        { slug: '4-3-1', title: '4.3.1 语句测试和语句覆盖率', fileName: '4-3-1-Statement Testing and Statement Coverage.mdx', quizFile: 'quiz-4-3-1.json' },
        { slug: '4-3-2', title: '4.3.2 分支测试和分支覆盖率', fileName: '4-3-2-Branch Testing and Branch Coverage.mdx', quizFile: 'quiz-4-3-2.json' },
        { slug: '4-3-3', title: '4.3.3 白盒测试的价值', fileName: '4-3-3-The Value of White-box Testing.mdx', quizFile: 'quiz-4-3-3.json' },
        { slug: '4-4-0', title: '4.4 基于经验的测试技术', fileName: '4-4-0-Experience-based Test Techniques.mdx', quizFile: 'quiz-4-4-0.json' },
        { slug: '4-4-1', title: '4.4.1 错误猜测', fileName: '4-4-1-Error Guessing.mdx', quizFile: 'quiz-4-4-1.json' },
        { slug: '4-4-2', title: '4.4.2 探索性测试', fileName: '4-4-2-Exploratory Testing.mdx', quizFile: 'quiz-4-4-2.json' },
        { slug: '4-4-3', title: '4.4.3 基于检查表的测试', fileName: '4-4-3-Checklist-Based Testing.mdx', quizFile: 'quiz-4-4-3.json' },
        { slug: '4-5-0', title: '4.5 基于协作的测试方法', fileName: '4-5-0-Collaboration-based Test Approaches.mdx', quizFile: 'quiz-4-5-0.json' },
        { slug: '4-5-1', title: '4.5.1 协作式用户故事编写', fileName: '4-5-1-Collaborative User Story Writing.mdx', quizFile: 'quiz-4-5-1.json' },
        { slug: '4-5-2', title: '4.5.2 验收标准', fileName: '4-5-2-Acceptance Criteria.mdx', quizFile: 'quiz-4-5-2.json' },
        { slug: '4-5-3', title: '4.5.3 验收测试驱动开发 (ATDD)', fileName: '4-5-3-Acceptance Test-Driven Development (ATDD).mdx', quizFile: 'quiz-4-5-3.json' },
        { slug: '5-1-1', title: '5.1.1 测试计划的目的和内容', fileName: '5-1-1-Purpose and Content of a Test Plan.mdx', quizFile: 'quiz-5-1-1.json' },
        { slug: '5-1-2', title: '5.1.2 测试人员对迭代和发布计划的贡献', fileName: '5-1-2-Tester’s Contribution to Iteration and Release Planning.mdx', quizFile: 'quiz-5-1-2.json' },
        { slug: '5-1-3', title: '5.1.3 准入标准和准出标准', fileName: '5-1-3-Entry Criteria and Exit Criteria.mdx', quizFile: 'quiz-5-1-3.json' },
        { slug: '5-1-4', title: '5.1.4 估算技术', fileName: '5-1-4-Estimation Techniques.mdx', quizFile: 'quiz-5-1-4.json' },
        { slug: '5-1-5', title: '5.1.5 测试用例优先级排序', fileName: '5-1-5-Test Case Prioritization.mdx', quizFile: 'quiz-5-1-5.json' },
        { slug: '5-1-6', title: '5.1.6 测试金字塔', fileName: '5-1-6-Test Pyramid.mdx', quizFile: 'quiz-5-1-6.json' },
        { slug: '5-1-7', title: '5.1.7 测试象限', fileName: '5-1-7-Testing Quadrants.mdx', quizFile: 'quiz-5-1-7.json' },
        { slug: '5-2-0', title: '5.2 风险管理', fileName: '5-2-0-Risk Management.mdx', quizFile: 'quiz-5-2-0.json' },
        { slug: '5-2-1', title: '5.2.1 风险定义和风险属性', fileName: '5-2-1-Risk Definition and Risk Attributes.mdx', quizFile: 'quiz-5-2-1.json' },
        { slug: '5-2-2', title: '5.2.2 项目风险和产品风险', fileName: '5-2-2-Project Risks and Product Risks.mdx', quizFile: 'quiz-5-2-2.json' },
        { slug: '5-2-3', title: '5.2.3 产品风险分析', fileName: '5-2-3-Product Risk Analysis.mdx', quizFile: 'quiz-5-2-3.json' },
        { slug: '5-2-4', title: '5.2.4 产品风险控制', fileName: '5-2-4-Product Risk Control.mdx', quizFile: 'quiz-5-2-4.json' },
        { slug: '5-3-0', title: '5.3 测试监控、测试控制和测试完成', fileName: '5-3-0-Test Monitoring, Test Control and Test Completion.mdx', quizFile: 'quiz-5-3-0.json' },
        { slug: '5-3-1', title: '5.3.1 测试中使用的度量', fileName: '5-3-1-Metrics used in Testing.mdx', quizFile: 'quiz-5-3-1.json' },
        { slug: '5-3-2', title: '5.3.2 测试报告的目的、内容和受众', fileName: '5-3-2-Purpose, Content and Audience for Test Reports.mdx', quizFile: 'quiz-5-3-2.json' },
        { slug: '5-3-3', title: '5.3.3 沟通测试状态', fileName: '5-3-3-Communicating the Status of Testing.mdx', quizFile: 'quiz-5-3-3.json' },
        { slug: '5-4-0', title: '5.4 配置管理', fileName: '5-4-0-Configuration Management.mdx', quizFile: 'quiz-5-4-0.json' },
        { slug: '5-5-0', title: '5.5 缺陷管理', fileName: '5-5-0-Defect Management.mdx', quizFile: 'quiz-5-5-0.json' },
        { slug: '6-1-0', title: '6.1 测试工具支持', fileName: '6-1-0-Tool Support for Testing.mdx', quizFile: 'quiz-6-1-0.json' },
        { slug: '6-2-0', title: '6.2 测试自动化的好处和风险', fileName: '6-2-0-Benefits and Risks of Test Automation.mdx', quizFile: 'quiz-6-2-0.json' }

    // { slug: 'testing-psychology', title: '1.3 测试心理学', fileName: '03-testing-psychology.mdx', quizFile: 'quiz03.json' },
];

const components = {
    // QuestionReveal, // 如果在MDX中直接使用<QuestionReveal />则需要，现在我们不在MDX中直接用它渲染整个quiz
    h3: (props) => <h3 className={styles.subheading} {...props} />,
    hr: (props) => <hr className={styles.divider} {...props} />,
};
// pages/study-materials/basic-testing/[lessonSlug].js (继续)

export default function LessonPage({ lessonContent, currentLessonMeta, quizData, prevLesson, nextLesson, lessonsForSidebar }) {
    const router = useRouter(); // 如果需要获取 locale 等信息

    // if (router.isFallback || !currentLessonMeta) { // Fallback 通常用于 ISR 或 getStaticPaths 的 fallback:true
    if (!currentLessonMeta) {
        return <p>课程信息加载中...</p>;
    }

    return (
        <>
            <Head>
                <title>{currentLessonMeta.title} - 基础测试 - SoftwareTestingLearn</title>
            </Head>
            <StudyMaterialsLayout
                activeSubNav="basic-testing"
                lessonSidebar={<LessonSidebar lessons={lessonsForSidebar} basePath="/study-materials/basic-testing" />}
            >
                <article className={styles.lessonArticle}>
                    <h1 className={styles.lessonTitle}>{currentLessonMeta.title}</h1>
                    {lessonContent.mdxSource ? (
                        <MDXRemote {...lessonContent.mdxSource} components={components} />
                    ) : (
                        <p>课程内容加载失败...</p>
                    )}

                    {quizData && quizData.questions && quizData.questions.length > 0 && (
                        <div className="quiz-section-container" style={{ marginTop: '50px', paddingTop:'30px', borderTop: '1px solid #eee' }}>
                            <h2>{quizData.title || '单元练习'}</h2>
                            {quizData.questions.map((question, index) => (
                                <QuestionReveal key={question.id || index} questionData={question} />
                            ))}
                        </div>
                    )}

                    {/* --- 新增：上一课/下一课导航 --- */}
                    <nav className={styles.lessonPager}>
                        {prevLesson && (
                            <Link href={`/study-materials/basic-testing/${prevLesson.slug}`} legacyBehavior>
                                <a className={styles.prevLink}>&larr; 上一课：{prevLesson.title}</a>
                            </Link>
                        )}
                        {nextLesson && (
                            <Link href={`/study-materials/basic-testing/${nextLesson.slug}`} legacyBehavior>
                                <a className={styles.nextLink}>下一课：{nextLesson.title} &rarr;</a>
                            </Link>
                        )}
                    </nav>
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

export async function getStaticProps({ params, locale /* 如果您已启用 i18n */ }) {
    const { lessonSlug } = params;
    const currentLessonIndex = lessonsMeta.findIndex(lesson => lesson.slug === lessonSlug); // 使用 lessonsMeta
    const currentLessonInfo = lessonsMeta[currentLessonIndex]; // 使用 lessonsMeta

    if (!currentLessonInfo) {
        return { notFound: true };
    }

    // 根据当前 locale 构造基础路径 (如果您已实现 i18n)
    // const lang = locale || 'zh'; // 假设 'zh' 是默认
    // const postsDirectory = path.join(process.cwd(), 'data', 'study-materials', 'basic-testing', lang);
    const postsDirectory = path.join(process.cwd(), 'data', 'study-materials', 'basic-testing'); // 当前非 i18n 路径

    // 1. 读取 MDX 课程内容
    const mdxFullPath = path.join(postsDirectory, currentLessonInfo.fileName);
    let lessonContent = { frontmatter: {}, mdxSource: null };
    let currentLessonTitleFromMDX = currentLessonInfo.title; // 默认使用 meta 中的标题

    try {
        const fileContents = fs.readFileSync(mdxFullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const mdxSource = await serialize(content, { parseFrontmatter: true });
        lessonContent = { frontmatter: data, mdxSource };
        currentLessonTitleFromMDX = data.title || currentLessonInfo.title; // 优先从 MDX frontmatter 获取标题
    } catch (error) {
        console.error(`Error reading MDX file ${currentLessonInfo.fileName}:`, error);
    }

    // 2. 读取 Quiz JSON 数据
    let quizData = null;
    if (currentLessonInfo.quizFile) {
        const quizFilePath = path.join(postsDirectory, currentLessonInfo.quizFile);
        try {
            const quizFileContent = fs.readFileSync(quizFilePath, 'utf8');
            quizData = JSON.parse(quizFileContent);
        } catch (error) {
            console.error(`Error reading Quiz JSON file ${currentLessonInfo.quizFile}:`, error);
        }
    }

    // 3. 确定上一课和下一课信息
    let prevLesson = null;
    if (currentLessonIndex > 0) {
        const prevLessonMeta = lessonsMeta[currentLessonIndex - 1];
        // 为了获取上一课的准确标题（可能来自其MDX frontmatter），理想情况下这里也需要读取
        // 但为简单起见，先用 lessonsMeta 中的标题
        prevLesson = { slug: prevLessonMeta.slug, title: prevLessonMeta.title };
    }

    let nextLesson = null;
    if (currentLessonIndex < lessonsMeta.length - 1) {
        const nextLessonMeta = lessonsMeta[currentLessonIndex + 1];
        nextLesson = { slug: nextLessonMeta.slug, title: nextLessonMeta.title };
    }

    // (如果您启用了 i18n 并使用 next-i18next)
    // const translations = await serverSideTranslations(lang, ['common', 'sidebar']); // 示例命名空间

    return {
        props: {
            lessonContent,
            currentLessonMeta: { ...currentLessonInfo, title: currentLessonTitleFromMDX }, // 确保传递的是最新标题
            quizData,
            prevLesson,
            nextLesson,
            lessonsForSidebar: lessonsMeta, // 侧边栏仍然使用完整的 lessonsMeta
            // ...(translations || {}), // 如果使用 next-i18next
        },
    };
}

