import type { LocalString } from './i18n'
import {
  Plane,
  PlaneLanding,
  IdCard,
  Smartphone,
  Building2,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react'

/**
 * 한국 정착 6단계 타임라인.
 * - 각 단계는 period(예상 시점), title, description, tasks(체크 가능)를 가짐.
 * - Timeline 컴포넌트와 Checklist 컴포넌트가 모두 이 데이터를 사용.
 */
export interface SettlementStep {
  id: string
  step: number
  icon: LucideIcon
  period: LocalString
  title: LocalString
  description: LocalString
  tasks: LocalString[]
}

export const settlementSteps: SettlementStep[] = [
  {
    id: 'pre-arrival',
    step: 1,
    icon: Plane,
    period: { ko: '입국 2~4주 전', zh: '入境前2~4周' },
    title: { ko: '입국 전 상담', zh: '入境前咨询' },
    description: {
      ko: '비자 종류, 체류 기간, 목적(유학/취업/투자)을 공유하면 필요 서류와 예상 일정을 정리해 드려요. 중국에서 미리 준비할 것만 먼저 챙깁니다.',
      zh: '告知签证类型、停留时间和目的(留学/就业/投资),我们帮您整理所需材料和日程。只需先准备在国内能办的部分。',
    },
    tasks: [
      { ko: '비자(SO/유학/취업) 종류 확인', zh: '确认签证(SO/留学/就业)类型' },
      { ko: '여권 유효기간 6개월 이상 확인', zh: '确认护照有效期6个月以上' },
      { ko: '증명사진·여권 사본 준비', zh: '准备证件照·护照复印件' },
      { ko: '초기 체류비(원화) 준비', zh: '准备初期韩币生活费' },
    ],
  },
  {
    id: 'airport',
    step: 2,
    icon: PlaneLanding,
    period: { ko: '도착 0~1일차', zh: '到达0~1天' },
    title: { ko: '공항 도착 후 유심/eSIM', zh: '到达机场后USIM/eSIM' },
    description: {
      ko: '인천공항에서 유심을 바로 발급받거나, 미리 신청한 eSIM을 설치합니다. 숙소 예약, 지도, 번역 앱이 당장 필요하니 데이터부터 켜는 것이 첫 번째입니다.',
      zh: '在仁川机场直接办理USIM,或安装提前申请的eSIM。预订住宿、地图、翻译应用马上要用,先开通流量是第一步。',
    },
    tasks: [
      { ko: '공항 유심 카운터 방문 or eSIM 설치', zh: '前往机场USIM柜台或安装eSIM' },
      { ko: '데이터·지도·번역 앱 작동 확인', zh: '确认流量·地图·翻译应用可用' },
      { ko: '숙소까지 교통편 확인(공항철도/택시)', zh: '确认到住宿的交通(机场铁路/出租)' },
      { ko: '환전 또는 ATM 인출', zh: '换汇或ATM取现' },
    ],
  },
  {
    id: 'arc',
    step: 3,
    icon: IdCard,
    period: { ko: '도착 7~14일차', zh: '到达7~14天' },
    title: { ko: '외국인등록증(ARC) 준비', zh: '办理外国人登录证(ARC)' },
    description: {
      ko: '90일 이상 체류 시 출입국사무소에 등록해야 합니다. 등록증이 있어야 은행 계좌, 정식 휴대폰 번호, 인터넷 가입이 모두 열립니다. 가장 중요한 관문이에요.',
      zh: '停留90天以上须到出入境管理厅登记。有登录证才能办理银行账户、正式手机号和宽带。这是最重要的关口。',
    },
    tasks: [
      { ko: '거주지 확정 후 Hi Korea 온라인 예약', zh: '确定住址后Hi Korea在线预约' },
      { ko: '신청서·여권·사진·체류지확인서 준비', zh: '准备申请表·护照·照片·居住地证明' },
      { ko: '출입국사무소 방문 접수', zh: '前往出入境厅递交' },
      { ko: '등록증 수령(약 2~4주)', zh: '领取登录证(约2~4周)' },
    ],
  },
  {
    id: 'verified-phone',
    step: 4,
    icon: Smartphone,
    period: { ko: '등록증 발급 후 1~3일', zh: '登录证发放后1~3天' },
    title: { ko: '본인인증 가능 휴대폰 번호 개통', zh: '开通可实名认证的手机号' },
    description: {
      ko: '외국인등록증 기반으로 정식 통신사 번호를 개통하면, 한국의 본인인증(SMS 인증)이 가능해져 은행·배달·쇼핑 앱 가입이 열립니다. 알뜰폰 전환도 이때 진행합니다.',
      zh: '凭登录证开通正式运营商号码后,即可进行韩国实名认证(短信验证),从而办理银行·外卖·购物应用。虚拟运营商转换也在此时进行。',
    },
    tasks: [
      { ko: '통신사 대리점 방문 (등록증·여권 지참)', zh: '前往运营商门店(带登录证·护照)' },
      { ko: '요금제 선택 (후불/알뜰폰)', zh: '选择套餐(后付费/虚拟运营商)' },
      { ko: '기존 유심 번호 이식(MNP)', zh: '迁移原USIM号码(MNP)' },
      { ko: '본인인증 서비스(PASS/토스) 가입', zh: '注册实名认证服务(PASS/Toss)' },
    ],
  },
  {
    id: 'bank-home-net',
    step: 5,
    icon: Building2,
    period: { ko: '등록증 발급 후 1~2주', zh: '登录证发放后1~2周' },
    title: { ko: '은행 · 집 · 인터넷 연결', zh: '银行 · 租房 · 宽带' },
    description: {
      ko: '은행 계좌와 체크카드를 만들고, 장기 숙소나 부동산 계약을 진행한 뒤, 인터넷과 렌탈을 설치합니다. 모두 중국어 통행이 가능한 매니저가 동행합니다.',
      zh: '办理银行账户和借记卡,签订长租或房产合同后安装宽带和租赁设备。全程有中文经理陪同。',
    },
    tasks: [
      { ko: '은행 계좌 + 체크카드 발급', zh: '开立银行账户+借记卡' },
      { ko: '부동산 계약 (확정일자 필수)', zh: '签房产合同(须确定日期)' },
      { ko: '인터넷·IPTV 설치 예약', zh: '预约宽带·IPTV安装' },
      { ko: '정수기/공기청정기 렌탈 신청', zh: '申请净水器/空气净化器租赁' },
    ],
  },
  {
    id: 'aftercare',
    step: 6,
    icon: HeartHandshake,
    period: { ko: '정착 이후 6개월', zh: '定居后6个月' },
    title: { ko: '사후관리', zh: '后续管理' },
    description: {
      ko: '등록증 갱신 시점 알림, 요금제 점검, 계약 만기 관리까지. 한 번 시작한 관계를 끝까지 유지합니다. 중국어로 언제든 다시 물어보실 수 있어요.',
      zh: '登录证续期提醒、套餐检查、合同到期管理。一次开始的关系,我们维护到底。随时可用中文再次咨询。',
    },
    tasks: [
      { ko: '등록증 갱신 일정 알림', zh: '登录证续期日程提醒' },
      { ko: '요금제·약정 만기 점검', zh: '套餐·合约到期检查' },
      { ko: '생활 서비스 문의 채널 유지', zh: '保留生活服务咨询渠道' },
      { ko: '귀국/연장 시 후속 안내', zh: '回国/延期后续指导' },
    ],
  },
]

/** 체크리스트 페이지용 — 단계와 무관하게 "주제별"로 묶은 체크리스트 그룹 */
export interface ChecklistGroup {
  id: string
  title: LocalString
  icon: LucideIcon
  items: LocalString[]
}

import {
  ClipboardCheck,
  Plane as PlaneIcon,
  IdCard as IdCardIcon,
  Landmark,
  Smartphone as PhoneIcon,
  Home as HomeIcon,
  Wifi as WifiIcon,
  LayoutGrid,
} from 'lucide-react'

export const checklistGroups: ChecklistGroup[] = [
  {
    id: 'pre-arrival',
    title: { ko: '입국 전 준비', zh: '入境前准备' },
    icon: ClipboardCheck,
    items: [
      { ko: '비자 발급 (유학/D/E/SO 등)', zh: '办理签证(留学/D/E/SO等)' },
      { ko: '여권 유효기간 6개월+ 확인', zh: '护照有效期6个月以上' },
      { ko: '항공권·초기 숙소 예약', zh: '预订机票·初期住宿' },
      { ko: '증명사진 3~5장 (3.5×4.5cm)', zh: '证件照3~5张(3.5×4.5cm)' },
      { ko: '초기 생활비 (원화 현금/환전)', zh: '初期生活费(韩币现金/换汇)' },
      { ko: '해외여행자 보험 가입', zh: '购买境外旅行保险' },
    ],
  },
  {
    id: 'airport',
    title: { ko: '공항 도착 후', zh: '到达机场后' },
    icon: PlaneIcon,
    items: [
      { ko: '입국심사 (심사관 질문 대비)', zh: '入境审查(准备好回答审查员提问)' },
      { ko: '유심/eSIM 발급 (데이터 확보)', zh: '办理USIM/eSIM(确保流量)' },
      { ko: 'T-money 교통카드 구매/충전', zh: '购买/充值T-money交通卡' },
      { ko: '공항철도·버스·택시 노선 확인', zh: '确认机场铁路·巴士·出租路线' },
      { ko: '숙소 체크인', zh: '入住住宿' },
    ],
  },
  {
    id: 'arc',
    title: { ko: '외국인등록증 (ARC)', zh: '外国人登录证(ARC)' },
    icon: IdCardIcon,
    items: [
      { ko: 'Hi Korea(hikorea.go.kr) 온라인 예약', zh: 'Hi Korea官网在线预约' },
      { ko: '신청서·여권·사진 준비', zh: '准备申请表·护照·照片' },
      { ko: '체류지 확인서 (집주인/숙소)', zh: '居住地证明(房东/住宿)' },
      { ko: '출입국사무소 방문·접수', zh: '前往出入境厅递交' },
      { ko: '등록증 수령 (발급 안내문 지참)', zh: '领取登录证(带发放通知)' },
    ],
  },
  {
    id: 'bank',
    title: { ko: '은행 계좌', zh: '银行账户' },
    icon: Landmark,
    items: [
      { ko: 'KB국민/신한/우리은행 방문', zh: '前往国民/新韩/友利银行' },
      { ko: '여권·등록증·한국 연락처 제시', zh: '出示护照·登录证·韩国联系方式' },
      { ko: '외국인 종합소득세/거주사실 증명(일부)', zh: '部分需外国人住民/居住证明' },
      { ko: '체크카드 발급 신청 (1~2주 소요)', zh: '申请借记卡(需1~2周)' },
      { ko: '인터넷뱅킹·OTP 등록', zh: '开通网银·OTP' },
    ],
  },
  {
    id: 'phone',
    title: { ko: '휴대폰 개통', zh: '手机开通' },
    icon: PhoneIcon,
    items: [
      { ko: '기기 모델 호환 여부 확인', zh: '确认机型兼容性' },
      { ko: '유심→정식 번호 전환 계획 수립', zh: '制定USIM→正式号码转换计划' },
      { ko: '통신사 또는 알뜰폰 요금제 비교', zh: '对比运营商或虚拟运营商套餐' },
      { ko: '본인인증 서비스 가입 (PASS 등)', zh: '注册实名认证(PASS等)' },
    ],
  },
  {
    id: 'housing',
    title: { ko: '집 구하기', zh: '租房' },
    icon: HomeIcon,
    items: [
      { ko: '예산·지역·출퇴근/통학 시간 설정', zh: '设定预算·区域·通勤/通学时间' },
      { ko: '부동산 매물 탐색 (직방/다방)', zh: '搜索房源(直房/达房)' },
      { ko: '전/월세 조건 및 관리비 확인', zh: '确认全/月租条件和管理费' },
      { ko: '확정일자 받기 (보증금 보호)', zh: '办理确定日期(保护押金)' },
      { ko: '입주일·계약서 통역 점검', zh: '确认入住日·合同翻译' },
    ],
  },
  {
    id: 'internet',
    title: { ko: '인터넷 설치', zh: '宽带安装' },
    icon: WifiIcon,
    items: [
      { ko: '여권/계약서로 가입 가능 통신사 확인', zh: '确认可凭护照/合同办理的运营商' },
      { ko: '속도·설치비·사은품 비교', zh: '对比网速·安装费·赠品' },
      { ko: '설치 예약 (입주일 이후)', zh: '预约安装(入住日之后)' },
      { ko: 'Wi-Fi 공유기 비교·준비', zh: '对比·准备Wi-Fi路由器' },
    ],
  },
  {
    id: 'apps',
    title: { ko: '생활 앱 설치', zh: '生活应用' },
    icon: LayoutGrid,
    items: [
      { ko: '지도: 네이버지도 / 카카오맵', zh: '地图:Naver地图/Kakao地图' },
      { ko: '배달: 배달의민족 / 요기요', zh: '外卖:民族外卖/要基要' },
      { ko: '결제: 카카오페이 / 네이버페이 / 토스', zh: '支付:Kakao Pay/Naver Pay/Toss' },
      { ko: '교통: 카카오택시 / 티머니GO', zh: '交通:Kakao出租/T-money GO' },
      { ko: '번역: 파파고 / 카카오 i 번역', zh: '翻译:Papago/Kakao i翻译' },
    ],
  },
]
