import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ExpandIcon } from '../icons/Expand'
import { SlideCard } from '../SlideCard'
import {
  getParts,
  SelectedTokenButton,
  TokenCell,
  TokenControl,
} from './CommonTokenControls'

export interface MobileTokenControlsProps {
  tokens?: TokenControl[]
}

export function MobileTokenControls({ tokens }: MobileTokenControlsProps) {
  if (!tokens || tokens.length === 0) {
    return null
  }

  const parts = getParts(tokens)

  return (
    <div className="md:hidden" data-role="chart-token-mobile-element">
      <div className="flex items-center gap-x-4">
        <span>View tokens</span>

        <div className="rounded-lg bg-gray-100 px-1 py-1 dark:bg-gray-750">
          <div data-role="chart-token-toggle">
            <SlideCard
              button={
                <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 text-base dark:bg-gray-750">
                  Select
                  <ExpandIcon />
                </div>
              }
              title="Choose a token"
              closeButtonText="Close tokens"
            >
              <div className="flex w-full flex-col gap-6">
                {parts.map((p, i) => (
                  <div key={i}>
                    <div className={`text-sm font-bold ${p.titleColor}`}>
                      {p.title}
                    </div>
                    <HorizontalSeparator className="mb-4 dark:border-gray-650" />
                    <div
                      className="flex flex-col gap-y-3 gap-x-6"
                      data-role="chart-token-controls"
                    >
                      {p.tokens.map((token, j) => (
                        <TokenCell token={token} key={j} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SlideCard>
          </div>
          <SelectedTokenButton />
        </div>
      </div>
    </div>
  )
}
