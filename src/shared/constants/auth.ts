export const LOGIN_PATH = '/login'

/** 세션 만료로 서버가 로그인 화면으로 되돌려보냈다는 표식. */
export const SESSION_EXPIRED_PARAM = 'expired'

/**
 * 세션 만료 시 리다이렉트할 경로.
 *
 * RSC 렌더 중에는 쿠키를 수정할 수 없어서 서버가 죽은 토큰을 직접 지우지 못한다.
 * 그래서 표식만 붙여 보내고, 실제 쿠키 삭제는 proxy가 이 표식을 보고 처리한다.
 */
export const SESSION_EXPIRED_REDIRECT = `${LOGIN_PATH}?${SESSION_EXPIRED_PARAM}=1`
