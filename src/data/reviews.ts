/**
 * 고객 후기 데이터
 * - 너무 과장되지 않게, 현실적인 문장으로 작성
 * - region/verified 추가로 신뢰감 부여
 *
 * 외국인 고객 후기(foreignerReviews)는 ko/zh 바이링얼.
 */
import type { LocalString } from './i18n'

export interface ReviewItem {
  id: number
  name: string
  region: string
  service: string
  rating: number
  date: string
  content: string
  verified: boolean
}

export const reviews: ReviewItem[] = [
  {
    id: 1,
    name: '김도윤',
    region: '서울 강동구',
    service: '인터넷 / IPTV',
    rating: 5,
    date: '2026-05-12',
    content:
      '기존에 쓰던 인터넷이 약정 끝나서 요금이 8만 원대까지 올랐어요. 여기서 비교해 보니 비슷한 속도로 3만 원대 절약되더라고요. 결합할인까지 챙겨주셔서 만족합니다.',
    verified: true,
  },
  {
    id: 2,
    name: '박서연',
    region: '경기 수원시',
    service: '가전 렌탈',
    rating: 5,
    date: '2026-04-28',
    content:
      '정수기 렌탈 알아보다가 여러 업체 영업이 다 달라서 헷갈렸는데, 한 번에 비교 견적을 받아보니까 깔끔했어요. 중도해지 위약금 부분도 미리 설명해 주셔서 그 부분이 제일 좋았습니다.',
    verified: true,
  },
  {
    id: 3,
    name: '이지호',
    region: '인천 연수구',
    service: '이사 + 입주청소',
    rating: 4.5,
    date: '2026-04-03',
    content:
      '이사와 청소를 같이 신청했는데, 한 명의 매니저가 쭉 연락을 받아주셔서 일이 단순했어요. 청소만 다른 업체 가려다가 여기서 묶어서 하길 잘했어요. 딱 한 가지, 주말 예약이 조금 빡빡했어요.',
    verified: true,
  },
  {
    id: 4,
    name: '최하린',
    region: '부산 해운대구',
    service: '휴대폰 / 알뜰폰',
    rating: 5,
    date: '2026-03-19',
    content:
      '부모님 알뜰폰 바꿔드리려고 상담받았어요. 데이터를 얼마 안 쓰시니까 월 8천 원대로 바꿔드렸고, 와이파이 연결하는 법까지 같이 안내해 주셔서 부모님도 편해하셨어요.',
    verified: true,
  },
  {
    id: 5,
    name: '정현우',
    region: '서울 마포구',
    service: '인터넷 / IPTV',
    rating: 4.5,
    date: '2026-03-02',
    content:
      'SKT 인터넷과 IPTV 결합하면 할인이 된다길래 여기저기 알아봤는데, 라이플 매니저가 한 번에 정리해 준 견적표가 제일 깔끔했어요. 설치 기사님까지 예약까지 다 해주셨고요.',
    verified: true,
  },
  {
    id: 6,
    name: '강세아',
    region: '경기 고양시',
    service: '이사',
    rating: 5,
    date: '2026-02-24',
    content:
      '24평에서 32평으로 이사했는데 포장이사 견적을 3곳 비교해주셨어요. 차이가 꽤 나더라고요. 결국 중간 정도 가격인데 에어컨 탈부착 포함된 곳으로 했고, 당일 작업도 꼼꼼했습니다.',
    verified: true,
  },
  {
    id: 7,
    name: '윤지호',
    region: '서울 송파구',
    service: '가전 렌탈',
    rating: 4,
    date: '2026-02-10',
    content:
      '안마의자 렌탈이 싶어서 신청했어요. 프리미엄 모델이라 비쌀 줄 알았는데 사은품 혜택까지 잘 챙겨줘서 만족합니다. 한 가지 아쉬운 건 첫 달 결제 일정이 조금 헷갈렸어요.',
    verified: true,
  },
  {
    id: 8,
    name: '오도현',
    region: '대구 수성구',
    service: '입주 청소',
    rating: 5,
    date: '2026-01-29',
    content:
      '싼 곳이 15만 원이길래 했다가 재청소까지 30만 원 들었던 경험이 있어서 이번엔 제대로. 평수별 공임과 옵션 비용을 미리 받아보니까 결정이 쉬웠어요. 작업 후 사진까지 보내주셔서 신뢰감 있었습니다.',
    verified: true,
  },
  {
    id: 9,
    name: '임서아',
    region: '서울 강남구',
    service: '휴대폰 / 알뜰폰',
    rating: 5,
    date: '2026-01-15',
    content:
      '외국인등록증 기반 본인인증 가능한 알뜰폰을 찾고 있었어요. 다른 알뜰폰은 안 된다더니 여기서 가능한 요금제 찾아줘서 정말 고마웠습니다. 본인인증도 바로 됐어요.',
    verified: true,
  },
  {
    id: 10,
    name: '배준서',
    region: '경기 성남시',
    service: '인터넷 / IPTV',
    rating: 4.5,
    date: '2026-01-08',
    content:
      '기존 통신사 약정이 4개월 남았는데 위약금 지원 프로모션 있는 쪽으로 번호이동. 위약금 28만 원이 0원이 됐어요. 매니저가 위약금 지원 통신사 찾는 법 알려줘서 진짜 도움됐습니다.',
    verified: true,
  },
  {
    id: 11,
    name: '황유진',
    region: '인천 부평구',
    service: '이사 + 입주청소',
    rating: 5,
    date: '2025-12-26',
    content:
      '연말 이사라 업체 구하기 빡셌는데 라이플에서 빠르게 매칭해줬어요. 이사+청소 묶어서 신청하니까 한 명의 매니저가 다 처리해줘서 복잡하지 않았습니다.',
    verified: true,
  },
  {
    id: 12,
    name: '신지원',
    region: '서울 은평구',
    service: '가전 렌탈',
    rating: 4,
    date: '2025-12-12',
    content:
      '정수기 + 공기청정기 묶어 렌탈. 구매가 더 싸다는 걸 알면서도 렌탈이 편해서 선택. 매니저가 총비용 비교표까지 만들어줘서 설득당한 느낌은 아니었어요. 깔끔한 안내였습니다.',
    verified: true,
  },
]

/**
 * 외국인 고객 후기.
 * - persona: 교환학생/직장인/장기여행자/투자자 네 가지
 * - content는 ko/zh 바이링얼. UI는 현재 locale에 따라 표시.
 */
export interface ForeignerReview {
  id: number
  /** 표시용 이름 (발음표 포함) */
  name: LocalString
  origin: LocalString
  persona: LocalString
  service: LocalString
  rating: number
  date: string
  content: LocalString
  verified: boolean
}

export const foreignerReviews: ForeignerReview[] = [
  {
    id: 101,
    name: { ko: '리원', zh: '李媛' },
    origin: { ko: '중국 상하이', zh: '中国上海' },
    persona: { ko: '교환학생', zh: '交换生' },
    service: { ko: '휴대폰 개통 + 정착 패키지', zh: '手机开通+定居套餐' },
    rating: 5,
    date: '2026-05-08',
    content: {
      ko: '인천공항에 도착하자마자 유심을 받을 수 있어서 길을 찾거나 숙소에 연락할 때 막막하지 않았어요. 등록증 나온 뒤 정식 번호로 바꾸는 것도 매니저가 다 챙겨줬고, WeChat으로 질문하면 빠르게 답이 와서 든든했습니다.',
      zh: '一到仁川机场就拿到USIM,找路和联系住宿都不慌。登录证下来后,经理帮我转成正式号码。在微信提问回复很快,很安心。',
    },
    verified: true,
  },
  {
    id: 102,
    name: { ko: '왕지에', zh: '王杰' },
    origin: { ko: '중국 베이징', zh: '中国北京' },
    persona: { ko: 'IT 직장인', zh: 'IT上班族' },
    service: { ko: '인터넷 + 은행 계좌', zh: '宽带+银行账户' },
    rating: 4.5,
    date: '2026-04-21',
    content: {
      ko: '출장이 아니라 정식 발령이라 집과 인터넷을 빨리 잡아야 했어요. 부동산 계약서 통역부터 인터넷 설치 예약까지 하루 만에 정리됐습니다. 다만 은행 체크카드는 발급까지 2주 걸려서 그 부분은 미리 시작하길 추천해요.',
      zh: '不是出差是正式调任,需要尽快落实房子和宽带。从合同翻译到宽带预约一天搞定。不过银行借记卡发卡要2周,建议尽早开始办理。',
    },
    verified: true,
  },
  {
    id: 103,
    name: { ko: '메이', zh: '小美' },
    origin: { ko: '중국 저장', zh: '中国浙江' },
    persona: { ko: '장기 여행자(D-2)', zh: '长期旅行者(D-2)' },
    service: { ko: '단기 데이터 + 알뜰폰', zh: '短期流量+虚拟运营商' },
    rating: 5,
    date: '2026-03-30',
    content: {
      ko: '한국에 3개월 머물 예정이라 굳이 정식 번호까지는 필요 없었어요. 데이터 위주 요금제로 월 2만 원대로 쓰고 있고, 카페에서 카카오톡으로 물어보면 친절하게 답해주셔서 혼자 여행하는데 큰 도움이 됐어요.',
      zh: '在韩停留3个月,不需要正式号码。用流量为主的套餐每月仅2万韩元。在咖啡馆用KakaoTalk提问也耐心回答,对独自旅行帮助很大。',
    },
    verified: true,
  },
  {
    id: 104,
    name: { ko: '장원', zh: '张远' },
    origin: { ko: '중국 칭다오', zh: '中国青岛' },
    persona: { ko: '부동산 투자자', zh: '房产投资者' },
    service: { ko: '정착 패키지 + 부동산 통역', zh: '定居套餐+房产翻译' },
    rating: 5,
    date: '2026-02-14',
    content: {
      ko: '투자 목적으로 서울에 자주 오는데, 확정일자나 보증금 보호 규정을 잘 몰라 매번 피곤했어요. 계약서 통역과 확정일자 처리까지 함께 해주니 중국에서 계약 조건을 미리 검토할 수 있었습니다. 사후관리도 꾸준히 연락 옵니다.',
      zh: '因投资常来首尔,以前不懂确定日期和押金保护,每次都很累。如今合同翻译和确定日期一起办,在中国也能提前审核条款。后续也会持续联系跟进。',
    },
    verified: true,
  },
]
