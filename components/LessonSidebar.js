// components/LessonSidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/LessonSidebar.module.css';

export default function LessonSidebar({ lessons, basePath }) {
    const router = useRouter();
    const currentLessonSlug = router.query.lessonSlug || lessons[0]?.slug; // 默认选中第一个

    return (
        <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>课程导览</h3>
            <ul className={styles.lessonList}>
                {lessons.map((lesson) => (
                    <li key={lesson.slug} className={currentLessonSlug === lesson.slug ? styles.activeItem : styles.listItem}>
                        <Link href={`${basePath}/${lesson.slug}`} legacyBehavior>
                            <a>{lesson.title}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}