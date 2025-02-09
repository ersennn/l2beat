import { Layer2 } from '@l2beat/config'
import {
  DetailedTvlApiResponse,
  TvlApiResponse,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { getProjectTvlTooltipText } from '../../../utils/project/getProjectTvlTooltipText'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../utils/risks/values'
import { getTvlStats, TvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { ScalingTvlViewEntry } from '../types'
import { ScalingTvlViewProps } from '../view/ScalingTvlView'

export function getScalingTvlView(
  config: Config,
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  tvl: number,
  verificationStatus: VerificationStatus,
): ScalingTvlViewProps {
  return {
    items: projects.map((project) =>
      getScalingTvlViewEntry(
        project,
        tvlApiResponse,
        tvl,
        config.features.detailedTvl,
        verificationStatus.projects[project.id.toString()],
      ),
    ),
    stagesEnabled: config.features.stages,
    upcomingEnabled: config.features.upcomingRollups,
    detailedTvlEnabled: config.features.detailedTvl,
  }
}

function getScalingTvlViewEntry(
  project: Layer2,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  aggregateTvl: number,
  detailedTvlEnabled: boolean,
  isVerified?: boolean,
): ScalingTvlViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]

  let stats: TvlStats | undefined

  if (!apiProject) {
    if (!project.isUpcoming) {
      throw new Error(`Project ${project.display.name} is missing in api`)
    }
  } else {
    stats = getTvlStats(apiProject, project.display.name, associatedTokens)
  }

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.display.provider,
    category: project.display.category,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    isVerified,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    tvl: stats && escrowsConfigured(project) ? formatUSD(stats.tvl) : undefined,
    tvlTooltip: detailedTvlEnabled
      ? getProjectTvlTooltipText(project.config)
      : project.config.tvlTooltip,
    tvlBreakdown:
      stats && escrowsConfigured(project) ? stats.tvlBreakdown : undefined,
    oneDayChange:
      stats && escrowsConfigured(project) ? stats.oneDayChange : undefined,
    sevenDayChange:
      stats && escrowsConfigured(project) ? stats.sevenDayChange : undefined,
    marketShare:
      stats && escrowsConfigured(project)
        ? formatPercent(stats.tvl / aggregateTvl)
        : undefined,
    purpose: project.display.purpose,
    stage: project.stage,
  }
}

export function escrowsConfigured(project: Layer2) {
  return project.config.escrows.length > 0
}
