import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 라우트 변경 / 해시 변경 시 해당 id로 스크롤.
 * react-router는 기본적으로 해시 스크롤을 하지 않으므로 직접 처리.
 * 상단 헤더 높이만큼 오프셋을 둔다.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        // 약간의 지연: 렌더 완료 후 스크롤 보장
        requestAnimationFrame(() => {
          const top =
            el.getBoundingClientRect().top + window.scrollY - 80 // header offset
          window.scrollTo({ top, behavior: 'smooth' })
        })
        return
      }
    }
    // 해시 없이 경로만 바뀌면 최상단
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
