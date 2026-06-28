import type { LucideIcon } from 'lucide-react'
import {
  Smartphone,
  Wifi,
  Landmark,
  Home,
  PackageCheck,
  Sparkles,
} from 'lucide-react'
import type { LocalString } from './i18n'

/**
 * 중국인/외국인 정착 서비스 카테고리.
 * - 핵심 문구는 ko/zh 바이링얼. en은 선택(지금은 일부만).
 * - accent는 ServiceCards 공용 accent 시스템을 그대로 활용 → 새 색 추가 불필요.
 */
import type { ServiceAccent } from './services'

export interface ChineseService {
  id: string
  icon: LucideIcon
  accent: ServiceAccent
  /** 별도 페이지가 있는 경우 라우트 경로 */
  to?: string
  /** "인기" 같은 배지 */
  tag?: LocalString
  title: LocalString
  summary: LocalString
  description: LocalString
  features: LocalString[]
}

export const chineseServices: ChineseService[] = [
  {
    id: 'mobile',
    icon: Smartphone,
    accent: 'brand',
    to: '/chinese-users/mobile',
    tag: { ko: '가장 인기', zh: '最受欢迎' },
    title: { ko: '중국인 휴대폰 개통', zh: '中国人手机开通' },
    summary: {
      ko: '도착 당일부터 통화·데이터',
      zh: '到达当天即可通话上网',
    },
    description: {
      ko: '공항 유심부터 외국인등록증 기반 본인인증 번호까지. 비자와 체류 목적에 맞춰 가장 빠르게 개통되는 방법을 안내해요.',
      zh: '从机场USIM到凭外国人登录证实名认证的号码,按签证和停留目的推荐最快开通方案。',
    },
    features: [
      { ko: '유심 / eSIM 즉시 개통', zh: 'USIM / eSIM 即时开通' },
      { ko: '외국인등록증 본인인증 번호', zh: '凭登录证实名号码' },
      { ko: '단기 체류 데이터 요금제', zh: '短期停留流量套餐' },
    ],
  },
  {
    id: 'internet',
    icon: Wifi,
    accent: 'gold',
    tag: { ko: '정착 필수', zh: '定居必备' },
    title: { ko: '외국인용 인터넷 설치', zh: '外国人宽带安装' },
    summary: {
      ko: '집 계약 직후 바로',
      zh: '签完房即可安装',
    },
    description: {
      ko: '외국인등록증이 없어도 여권과 부동산 계약서로 설치 가능한 요금제가 있어요. 통신사 3사 비교 후 가장 조건 좋은 쪽으로 안내드려요.',
      zh: '没有登录证,凭护照和租房合同也能安装。三大运营商对比后推荐最优方案。',
    },
    features: [
      { ko: '여권/계약서 기반 설치', zh: '凭护照/合同安装' },
      { ko: '통신사 3사 요금제 비교', zh: '三大运营商套餐对比' },
      { ko: 'Wi-Fi 공유기 포함 옵션', zh: '含 Wi-Fi 路由器选项' },
    ],
  },
  {
    id: 'bank',
    icon: Landmark,
    accent: 'amber',
    title: { ko: '은행 계좌 개설 안내', zh: '银行开户指导' },
    summary: {
      ko: '외국인 계좌, 한 번에',
      zh: '外国人账户一站搞定',
    },
    description: {
      ko: '외국인등록증과 여권이 있으면 KB국민·신한·우리은행 등에서 체크카드까지 발급받을 수 있어요. 미리 필요 서류를 정리해 드려요.',
      zh: '有登录证和护照,可在国民·新韩·友利等银行办理借记卡。提前帮您整理所需材料。',
    },
    features: [
      { ko: '은행별 필요 서류 정리', zh: '各银行所需材料清单' },
      { ko: '체크카드 발급 동반', zh: '陪同办理借记卡' },
      { ko: '환전·송금 기초 안내', zh: '换汇·汇款基础指导' },
    ],
  },
  {
    id: 'housing',
    icon: Home,
    accent: 'violet',
    title: { ko: '집 구하기 / 부동산', zh: '租房 / 房产' },
    summary: {
      ko: '한국 부동산, 안전하게',
      zh: '韩国房产,安全租住',
    },
    description: {
      ko: '전·월세 계약의 차이, 확정일자, 보증금 보호까지. 중국어 가능한 부동산 매물과 계약서 통역을 연결해 드려요.',
      zh: '全/月租差异、确定日期、押金保护全说明。对接懂中文的房源与合同翻译。',
    },
    features: [
      { ko: '전/월세 계약 차이 설명', zh: '全/月租差异讲解' },
      { ko: '확정일자·보증금 안내', zh: '确定日期·押金指导' },
      { ko: '중국어 계약서 통역', zh: '中文合同翻译' },
    ],
  },
  {
    id: 'life-bundle',
    icon: PackageCheck,
    accent: 'mint',
    tag: { ko: '번들 혜택', zh: '组合优惠' },
    title: { ko: '이사 / 청소 / 렌탈', zh: '搬家 / 保洁 / 租赁' },
    summary: {
      ko: '입주 한 번에 정리',
      zh: '入住一次搞定',
    },
    description: {
      ko: '이사, 입주 청소, 정수기/공기청정기 렌탈까지 묶어서 신청. 중국어 가능 업체를 우선 배정하고 견적을 투명히 비교해요.',
      zh: '搬家、入住保洁、净水器/空气净化器租赁一起申请。优先安排懂中文的商家,价格透明对比。',
    },
    features: [
      { ko: '중국어 가능 업체 우선 배정', zh: '优先安排中文商家' },
      { ko: '평수별 청소 견적 비교', zh: '按面积保洁报价对比' },
      { ko: '렌탈 총비용 사전 안내', zh: '租赁总费用预先说明' },
    ],
  },
  {
    id: 'settlement-pack',
    icon: Sparkles,
    accent: 'brand',
    to: '/chinese-users/settlement',
    tag: { ko: '추천 패키지', zh: '推荐套餐' },
    title: { ko: '한국 정착 패키지', zh: '韩国定居套餐' },
    summary: {
      ko: '처음부터 끝까지 챙김',
      zh: '从头到尾全程照料',
    },
    description: {
      ko: '입국 전 상담부터 외국인등록증, 휴대폰, 은행, 인터넷, 집까지. 한 명의 전담 매니저가 중국어로 끝까지 동행합니다.',
      zh: '从入境前咨询到登录证、手机、银行、宽带、租房。一位专属经理用中文全程陪同。',
    },
    features: [
      { ko: '전담 매니저 1:1 배정', zh: '专属经理1对1服务' },
      { ko: '단계별 체크리스트 제공', zh: '分阶段清单提供' },
      { ko: '사후관리 6개월', zh: '6个月后续管理' },
    ],
  },
]

/** 중국인 정착 페이지 상단 히어로 카피 (바이링ugal) */
export const chineseHero = {
  eyebrow: {
    ko: '외국인 정착 서비스 · 中文 상담 가능',
    zh: '外国人定居服务 · 可中文咨询',
  },
  title: {
    ko: '한국 생활 시작, 중국어로 편하게 준비하세요',
    zh: '开启韩国生活,用中文轻松准备',
  },
  description: {
    ko: '휴대폰 개통부터 인터넷 설치, 은행·집·생활 서비스까지 중국어 상담으로 쉽게 안내해 드립니다. "한국에서 어떻게 시작하지?" — 이 질문에 정면으로 답해요.',
    zh: '从手机开通到宽带安装、银行·租房·生活服务,全程中文指导。"在韩国怎么开始?"——我们正面回答这个问题。',
  },
  stats: [
    { value: '4,200+', label: { ko: '외국인 정착 상담', zh: '外国人定居咨询' } },
    { value: '14일 내', label: { ko: '평균 정착 완료', zh: '平均完成定居' } },
    { value: '1:1', label: { ko: '전담 매니저', zh: '专属经理' } },
  ],
}

/** 모집 채널 (WeChat / KakaoTalk) */
export const contactChannels = {
  wechat: {
    id: 'wechat',
    label: { ko: 'WeChat 상담', zh: '微信咨询' },
    handle: 'lifful_kr',
    note: { ko: '중국에서 가장 편한 채널', zh: '中国最常用渠道' },
    color: '#07C160', // WeChat 브랜드 그린
    qrPlaceholder: 'WeChat QR',
  },
  kakao: {
    id: 'kakao',
    label: { ko: '카카오톡 상담', zh: 'KakaoTalk 咨询' },
    handle: '@라이플',
    note: { ko: '한국에서 가장 빠른 응답', zh: '韩国最快回复' },
    color: '#FEE500', // KakaoTalk 노랑
    qrPlaceholder: 'KakaoTalk QR',
  },
} as const
