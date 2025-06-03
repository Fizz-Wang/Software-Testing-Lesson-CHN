// pages/index.js
import Head from 'next/head';
import styles from '../styles/Home.module.css'; // 我们会创建一个新的 CSS Module 文件

export default function HomePage() {
    return (
        <>
            <Head>
                <title>欢迎 - 软件测试学习平台</title>
                {/* 可以添加更具体的 meta 描述 */}
            </Head>
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle} data-aos="fade-down">
                    探索软件测试的世界
                </h1>
                <p className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="200">
                    一站式学习平台，从基础到高级，全面覆盖软件测试知识体系与面试技巧。
                </p>

            </div>

            <section className={styles.featuresSection}>
                <h2 className={styles.sectionTitle} data-aos="fade-up">平台特色</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="100">
                        <h3>系统化学习路径</h3>
                        <p>精心设计的单元课程，助您循序渐进掌握核心技能。</p>
                    </div>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="200">
                        <h3>实战化单元测试</h3>
                        <p>每单元均配备测试题，巩固所学，检验成果。</p>
                    </div>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="300">
                        <h3>海量面试题库</h3>
                        <p>覆盖各类常见面试题，助您从容应对各种挑战。</p>
                    </div>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="400">
                        <h3>分类清晰易查阅</h3>
                        <p>面试题按技术点、岗位方向精细分类，查找便捷。</p>
                    </div>
                </div>
            </section>

            <section className={styles.testimonialSection} data-aos="zoom-in-up">
                <h2 className={styles.sectionTitle}>他们怎么说？ (示例)</h2>
                <div className={styles.testimonialCard}>
                    <p>"这个平台的内容非常实用，帮助我系统地复习了测试知识，面试也更有底气了！"</p>
                    <span>- 一位满意的学员</span>
                </div>
            </section>
        </>
    );
}