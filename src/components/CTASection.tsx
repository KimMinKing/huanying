import { MessageCircleMore, MessageCircle, ArrowRight, QrCode } from 'lucide-react'
import { contactChannels } from '../data/chineseServices'
import { t, type Locale } from '../data/i18n'

/**
 * 중국어 상담 CTA 섹션.
 * - WeChat(그린) / KakaoTalk(노랑) 채널 카드 + 폼 CTA.
 * - 다크(ink) 배경으로 채널 색이 잘 튀게 설계.
 * - QR 영역은 placeholder — 실제 운영 시 이미지로 교체.
 */
export function CTASection({ locale = 'ko' }: { locale?: Locale }) {
  const wechat = contactChannels.wechat
  const kakao = contactChannels.kakao

  return (
    <section id="cn-consult" className="section bg-ink text-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-semibold text-gold-300">
            <MessageCircle className="h-3.5 w-3.5" />
            중국어 상담 · 中文咨询
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            가장 편한 채널로 먼저 연락해 보세요.
            <br />
            <span className="text-gold-300">무엇이든 물어봐 주셔도 돼요.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            상담은 무료이고, 강요 없습니다. 위챗이 편하시면 위챗으로, 한국에
            계시면 카카오톡이 더 빠를 수 있어요. 복잡한 한국 생활 시작, 먼저
            물어보는 것부터 시작하면 됩니다.
          </p>
        </div>

        {/* 채널 카드 */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* WeChat */}
          <ChannelCard
            name="WeChat"
            label={t(wechat.label, locale)}
            handle={wechat.handle}
            note={t(wechat.note, locale)}
            color={wechat.color}
            icon={<MessageCircleMore className="h-7 w-7" />}
            dark
          />
          {/* KakaoTalk */}
          <ChannelCard
            name="KakaoTalk"
            label={t(kakao.label, locale)}
            handle={kakao.handle}
            note={t(kakao.note, locale)}
            color={kakao.color}
            icon={<MessageCircle className="h-7 w-7" />}
          />
        </div>

        {/* 폼 CTA */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold">상담 내용이 많다면 폼으로 보내주세요.</p>
            <p className="mt-1 text-sm text-slate-400">
              체류 기간, 비자, 목적을 적어주시면 더 정확한 안내가 가능해요.
            </p>
          </div>
          <a
            href="/#consult"
            className="btn bg-brand-600 px-6 py-3 text-white hover:bg-brand-500"
          >
            무료 정착 상담 신청
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function ChannelCard({
  name,
  label,
  handle,
  note,
  color,
  icon,
  dark = false,
}: {
  name: string
  label: string
  handle: string
  note: string
  color: string
  icon: React.ReactNode
  dark?: boolean
}) {
  return (
    <a
      href="#cn-consult"
      className="group relative flex items-center gap-5 overflow-hidden rounded-4xl p-6 transition duration-300 hover:-translate-y-1"
      style={{ backgroundColor: color }}
    >
      {/* 아이콘 원 */}
      <span
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
          dark ? 'bg-black/15 text-white' : 'bg-black/10 text-[#191919]'
        }`}
      >
        {icon}
      </span>

      <div className="flex-1">
        <p className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-white/70' : 'text-black/60'}`}>
          {name}
        </p>
        <p className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-[#191919]'}`}>
          {label}
        </p>
        <p className={`mt-0.5 text-sm font-semibold ${dark ? 'text-white/85' : 'text-black/75'}`}>
          {handle}
        </p>
        <p className={`mt-2 text-xs ${dark ? 'text-white/70' : 'text-black/60'}`}>{note}</p>
      </div>

      {/* QR placeholder */}
      <span
        className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl text-[10px] font-bold ${
          dark ? 'bg-white/15 text-white/80' : 'bg-black/5 text-black/60'
        }`}
      >
        <QrCode className="h-8 w-8" />
        <span className="mt-1">QR</span>
      </span>
    </a>
  )
}
