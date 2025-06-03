// components/StudyMaterialsLayout.js
import Link from 'next/link';
import styles from '../styles/StudyMaterialsLayout.module.css';

// 这是一个简化的二级导航，您可以后续替换为更复杂的Tabs或下拉菜单
const SubNav = ({ active }) => (
    <nav className={styles.subNav}>
        <Link href="/study-materials/basic-testing/what-is-testing" legacyBehavior>
            <a className={active === 'basic-testing' ? styles.activeLink : styles.navLink}>基础测试</a>
        </Link>
        <Link href="/study-materials/automated-testing/TBD" legacyBehavior>
            <a className={active === 'automated-testing' ? styles.activeLink : styles.navLink}>自动化测试</a>
        </Link>
        {/* 可以添加更多分类 */}
    </nav>
);

export default function StudyMaterialsLayout({ children, activeSubNav, lessonSidebar }) {
    return (
        <div className={styles.studyMaterialsPage}>
            <SubNav active={activeSubNav} />
            <div className={styles.contentArea}>
                {lessonSidebar && <aside className={styles.lessonSidebarContainer}>{lessonSidebar}</aside>}
                <section className={styles.lessonContentContainer}>
                    {children}
                </section>
            </div>
        </div>
    );
}