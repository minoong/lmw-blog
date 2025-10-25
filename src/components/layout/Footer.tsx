import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300">About</h3>
            <p className="text-base text-gray-600 dark:text-gray-400">개발자의 기술 블로그입니다. 개발 경험과 학습 내용을 공유합니다.</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-base text-gray-500 dark:text-gray-500">&copy; {new Date().getFullYear()} Tech Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
