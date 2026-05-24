import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AbilityPageFrame } from '@/components/ability/AbilityPageFrame'
import { AbilityPageTurnControls } from '@/components/ability/AbilityPageTurnControls'
import { AbilitySchemeOneLanding } from '@/components/ability/AbilitySchemeOneLanding'
import { AbilitySectionTabs } from '@/components/ability/AbilitySectionTabs'
import { NavControl } from '@/components/common/NavControl'
import { PageTransition } from '@/components/common/PageTransition'
import { ScreenShell } from '@/components/common/ScreenShell'
import {
  getAbilityById,
  getAbilitySectionOrder,
  normalizeAbilitySection,
  type AbilitySectionKey,
} from '@/data/abilities'

export function AbilitySectionPage() {
  const { abilityId, section } = useParams()
  const navigate = useNavigate()
  const ability = getAbilityById(abilityId)
  const sectionOrder = useMemo(() => getAbilitySectionOrder(ability), [ability])
  const activeSection = useMemo(() => {
    const normalizedSection = normalizeAbilitySection(section) ?? 'understand'

    return sectionOrder.includes(normalizedSection) ? normalizedSection : sectionOrder[0]
  }, [section, sectionOrder])

  if (!ability) {
    return (
      <ScreenShell>
        <NavControl />
      </ScreenShell>
    )
  }

  const handleSchemeOneSectionSelect = (nextSection: AbilitySectionKey) => {
    navigate(`/ability/${ability.id}/${nextSection}`)
  }

  return (
    <PageTransition disableOpacity>
      <main className="relative z-10 h-screen max-h-screen overflow-hidden bg-[#030405] supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh">
        <AbilityPageFrame abilityId={ability.id} scheme="one" />
        <NavControl
          actionButtonClassName="!size-[clamp(48px,5.19vh,56px)] [&_svg]:!size-[clamp(24px,2.78vh,30px)]"
          actionsClassName="gap-[clamp(10px,0.93vh,12px)]"
          brandClassName="!h-[clamp(48px,5.19vh,56px)] [&_img]:!h-[clamp(28px,3.33vh,36px)]"
          brandVariant="dark"
          className="!h-[clamp(64px,9.26vh,100px)] !px-[clamp(16px,2.08vw,40px)] !py-[clamp(18px,2.78vh,30px)]"
          ghostActions
          showBack={false}
        />
        <AbilitySectionTabs
          ability={ability}
          activeSection={activeSection}
          appearance="plain"
          onSectionSelect={handleSchemeOneSectionSelect}
        />
        <AbilitySchemeOneLanding ability={ability} activeSection={activeSection} onSectionSelect={handleSchemeOneSectionSelect} />
        <AbilityPageTurnControls
          activeSection={activeSection}
          onSectionSelect={handleSchemeOneSectionSelect}
          sectionOrder={sectionOrder}
        />
      </main>
    </PageTransition>
  )
}
