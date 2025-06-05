// components/StudyMaterialsLayout.js
import Link from 'next/link';
import styles from '../styles/StudyMaterialsLayout.module.css';
import React, { useState, useEffect } from 'react'; // 导入 useState 和 useEffect

// SubNav 组件保持不变或按需调整
const SubNav = ({ active }) => (
    <nav className={styles.subNav}>
        <Link href="/study-materials/basic-testing/what-is-testing" legacyBehavior>
            <a className={active === 'basic-testing' ? styles.activeLink : styles.navLink}>基础测试</a>
        </Link>
        <Link href="/study-materials/automation-testing/intro-to-automation" legacyBehavior>
            <a className={active === 'automation-testing' ? styles.activeLink : styles.navLink}>自动化测试</a>
        </Link>
    </nav>
);

export default function StudyMaterialsLayout({ children, activeSubNav, lessonSidebar }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth <= 768);
        };
        checkMobileView(); // Initial check
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    const toggleMobileSidebar = () => {
        if (isMobileView) { // 只在移动视图下响应切换
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        }
    };

    return (
        <div className={styles.studyMaterialsPage}>
            <SubNav active={activeSubNav} />

            {/* 仅在移动视图下显示切换按钮 */}
            {isMobileView && lessonSidebar && (
                <button onClick={toggleMobileSidebar} className={styles.sidebarToggleButton}>
                    {isMobileSidebarOpen ? '隐藏课程导览' : '显示课程导览'}
                </button>
            )}

            <div className={styles.contentArea}>
                {lessonSidebar && (
                    <aside
                        className={`${styles.lessonSidebarContainer} ${isMobileView && !isMobileSidebarOpen ? styles.hiddenOnMobile : ''}`}
                    >
                        {lessonSidebar}
                    </aside>
                )}
                <section className={`${styles.lessonContentContainer} ${isMobileView && lessonSidebar && !isMobileSidebarOpen ? styles.fullWidthOnMobileWhenSidebarHidden : ''}`}>
                    {children}
                </section>
            </div>
        </div>
    );
}