import Legal from './Legal'
import SEO from '../components/SEO'

/**
 * 개인정보처리방침 페이지.
 * ⚠️ 한국 표준 템플릿. 개인정보보호법 기준. 실제 수집 항목과 목적에 맞게 수정 필요.
 */
export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="개인정보처리방침"
        description="라이플 개인정보처리방침 — 수집 항목, 이용 목적, 보유 기간, 이용자 권리를 안내합니다."
        path="/privacy"
      />
      <Legal
      title="개인정보처리방침"
      effectiveDate="2026년 6월 28일"
      sections={[
        {
          id: 'general',
          heading: '총칙',
          body: (
            <p>
              라이플 주식회사(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요하게 취급하며,
              「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련
              법령을 준수합니다. 본 방침은 회사가 수집하는 개인정보의 항목, 수집·이용 목적,
              보유 기간, 이용자의 권리 등을 안내합니다.
            </p>
          ),
        },
        {
          id: 'collect',
          heading: '수집하는 개인정보 항목',
          body: (
            <>
              <p>회사는 다음의 개인정보를 수집합니다.</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-bold uppercase tracking-wider text-ink-muted">
                    <tr>
                      <th className="px-3 py-2.5">구분</th>
                      <th className="px-3 py-2.5">항목</th>
                      <th className="px-3 py-2.5">비고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-3 py-2.5 align-top font-semibold">필수</td>
                      <td className="px-3 py-2.5 align-top">이름, 연락처(휴대전화)</td>
                      <td className="px-3 py-2.5 align-top text-ink-muted">
                        상담 신청 시
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5 align-top font-semibold">선택</td>
                      <td className="px-3 py-2.5 align-top">
                        이메일, 현재 사용 통신사/서비스, 문의 내용, 관심 서비스
                      </td>
                      <td className="px-3 py-2.5 align-top text-ink-muted">
                        더 정확한 비교를 위해
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5 align-top font-semibold">자동 수집</td>
                      <td className="px-3 py-2.5 align-top">
                        IP 주소, 쿠키, 방문 기록, 브라우저 정보
                      </td>
                      <td className="px-3 py-2.5 align-top text-ink-muted">
                        서비스 품질 향상, 통계
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5 align-top font-semibold">
                        외국인 정착
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        국적, 체류 비자 종류, 체류 기간, 거주 지역, 예산
                      </td>
                      <td className="px-3 py-2.5 align-top text-ink-muted">
                        정착 패키지 신청 시
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-muted">
                ※ 외국인등록증, 여권 등 신분증 사본은 별도 동의 시에만 수집하며, 파일
                업로드 기능 도입 후에만 요청됩니다.
              </p>
            </>
          ),
        },
        {
          id: 'purpose',
          heading: '수집 및 이용 목적',
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>상담 신청 접수 및 매니저 회신</li>
              <li>요청한 서비스 카테고리에 맞는 파트너사 매칭·견적 안내</li>
              <li>서비스 개선을 위한 통계 분석 및 품질 관리</li>
              <li>공지사항, 이벤트 안내(마케팅 정보는 별도 동의 시에만)</li>
              <li>부정 이용 방지 및 분쟁 해결</li>
            </ul>
          ),
        },
        {
          id: 'retention',
          heading: '보유 및 이용 기간',
          body: (
            <p>
              회사는 이용자의 개인정보를 <strong>수집 목적 달성 시까지</strong> 보유하며,
              그 이후에는 지체 없이 파기합니다. 단, 다음 정보는 관련 법령에 따라 일정 기간
              보존합니다.
            </p>
          ),
        },
        {
          id: 'retention-table',
          heading: '법정 보존 정보',
          body: (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold uppercase tracking-wider text-ink-muted">
                  <tr>
                    <th className="px-3 py-2.5">항목</th>
                    <th className="px-3 py-2.5">보존 기간</th>
                    <th className="px-3 py-2.5">근거</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-3 py-2.5">계약 또는 청약철회 기록</td>
                    <td className="px-3 py-2.5">5년</td>
                    <td className="px-3 py-2.5 text-ink-muted">전자상거래법</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5">대금결제 및 재화 등 공급 기록</td>
                    <td className="px-3 py-2.5">5년</td>
                    <td className="px-3 py-2.5 text-ink-muted">전자상거래법</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5">소비자 불만 또는 분쟁 처리 기록</td>
                    <td className="px-3 py-2.5">3년</td>
                    <td className="px-3 py-2.5 text-ink-muted">전자상거래법</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5">접속 로그</td>
                    <td className="px-3 py-2.5">3개월</td>
                    <td className="px-3 py-2.5 text-ink-muted">
                      통신비밀보호법
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: 'third-party',
          heading: '제3자 제공',
          body: (
            <p>
              회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단,
              상담·견적 목적으로 파트너사(통신사·렌탈사·이사 업체 등)에게 최소한의 정보
              (이름, 연락처, 요청 내용)를 전달하는 경우, 사전 동의를 받습니다.
            </p>
          ),
        },
        {
          id: 'consignment',
          heading: '개인정보 처리 위탁',
          body: (
            <p>
              회사는 서비스 향상을 위해 다음 업무를 외부 전문업체에 위탁할 수 있습니다.
              위탁 시 계약을 통해 개인정보 보호 의무를 명확히 합니다.
            </p>
          ),
        },
        {
          id: 'rights',
          heading: '이용자의 권리',
          body: (
            <p>
              이용자는 언제든지 본인의 개인정보에 대해 열람·정정·삭제·처리정지를 요구할 수
              있습니다. 권리 행사는 서면, 전화, 이메일로 가능하며, 회사는 지체 없이
              조치합니다.
            </p>
          ),
        },
        {
          id: 'security',
          heading: '개인정보 보호 조치',
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>개인정보의 암호화 저장 및 전송 (HTTPS/TLS)</li>
              <li>접근 권한 통제 및 인증 (최소 권한 원칙)</li>
              <li>보안 프로그램 설치 및 주기적 갱신</li>
              <li>임직원 개인정보보호 교육</li>
            </ul>
          ),
        },
        {
          id: 'officer',
          heading: '개인정보보호 책임자',
          body: (
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임질 개인정보보호 책임자를
              다음과 같이 지정합니다. 개인정보 보호와 관련한 문의는 아래 연락처로
              주시기 바랍니다.
            </p>
          ),
        },
        {
          id: 'contact',
          heading: '연락처',
          body: (
            <ul className="list-none space-y-1.5">
              <li>
                <strong>개인정보보호 책임자:</strong> (성명 입력 필요)
              </li>
              <li>
                <strong>이메일:</strong>{' '}
                <a
                  href="mailto:privacy@lifful.example"
                  className="text-brand-700 underline underline-offset-2"
                >
                  privacy@lifful.example
                </a>
              </li>
              <li>
                <strong>전화:</strong> 1533-0000 (실제 번호로 교체 필요)
              </li>
              <li>
                <strong>주소:</strong> 서울특별시 강남구 테헤란로 000, 0층 (실제 주소로 교체)
              </li>
            </ul>
          ),
        },
      ]}
      />
    </>
  )
}
