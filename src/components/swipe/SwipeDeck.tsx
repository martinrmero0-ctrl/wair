"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOneSignal } from "@/hooks/useOneSignal";
import {
  hasCompletedDeckBefore,
  markFirstDeckComplete,
  shouldShowNotificationPrompt,
} from "@/lib/notifications/prompt-storage";
import { isOneSignalEnvironment } from "@/lib/onesignal/environment";
import { DAILY_DECK_SIZE } from "@/lib/swipe/catalog";
import { getPersonalizedDeck } from "@/lib/swipe/getPersonalizedDeck";
import { getSwipeHistoryCount, recordSwipe } from "@/lib/swipe/swipe-history";
import type { DailyPiece } from "@/lib/swipe/types";
import { saveToWishlist } from "@/lib/wishlist/storage";
import { DeckComplete } from "./DeckComplete";
import { DeckTasteLabel } from "./DeckTasteLabel";
import { NotificationPermissionModal } from "./NotificationPermissionModal";
import { ProgressPips } from "./ProgressPips";
import { SwipeActions } from "./SwipeActions";
import { SwipeCard } from "./SwipeCard";

const SWIPE_THRESHOLD = 96;

type SwipeDirection = "left" | "right";

export function SwipeDeck() {
  const { requestPermission } = useOneSignal();
  const [deck, setDeck] = useState<DailyPiece[]>([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pointerStart = useRef(0);
  const dragXRef = useRef(0);

  useEffect(() => {
    setDeck(getPersonalizedDeck());
    setHistoryCount(getSwipeHistoryCount());
    setHydrated(true);
  }, []);

  const completed = index;
  const isDone = hydrated && index >= deck.length;
  const current = deck[index];
  const next = deck[index + 1];

  const advance = useCallback(
    (direction: SwipeDirection, piece: DailyPiece) => {
      if (isExiting || isDone) return;

      setIsExiting(true);
      const exitX = direction === "right" ? 420 : -420;

      recordSwipe(piece, direction === "right" ? "liked" : "passed");
      setHistoryCount(getSwipeHistoryCount());

      if (direction === "right") {
        saveToWishlist(piece);
      }

      dragXRef.current = exitX;
      setDragX(exitX);

      window.setTimeout(() => {
        setIndex((i) => i + 1);
        setDragX(0);
        dragXRef.current = 0;
        setIsExiting(false);
      }, 220);
    },
    [isDone, isExiting],
  );

  const handlePass = useCallback(() => {
    if (current) advance("left", current);
  }, [advance, current]);

  const handleSave = useCallback(() => {
    if (current) advance("right", current);
  }, [advance, current]);

  const dragLabel: "save" | "pass" | null =
    dragX > 40 ? "save" : dragX < -40 ? "pass" : null;

  const onPointerDown = (e: React.PointerEvent) => {
    if (isExiting || isDone || !current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStart.current = e.clientX;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isExiting) return;
    const x = e.clientX - pointerStart.current;
    dragXRef.current = x;
    setDragX(x);
  };

  const finishDrag = () => {
    if (!isDragging || isExiting || !current) return;
    setIsDragging(false);

    const x = dragXRef.current;
    if (x > SWIPE_THRESHOLD) {
      advance("right", current);
    } else if (x < -SWIPE_THRESHOLD) {
      advance("left", current);
    } else {
      dragXRef.current = 0;
      setDragX(0);
    }
  };

  const onPointerUp = () => finishDrag();
  const onPointerCancel = () => {
    setIsDragging(false);
    if (!isExiting) {
      dragXRef.current = 0;
      setDragX(0);
    }
  };

  const rotation = dragX * 0.04;
  const opacity = isExiting ? 0 : 1 - Math.min(Math.abs(dragX) / 500, 0.15);

  const deckSize = deck.length || DAILY_DECK_SIZE;

  useEffect(() => {
    if (!isDone) return;

    if (!hasCompletedDeckBefore()) {
      markFirstDeckComplete();
      if (
        isOneSignalEnvironment() &&
        shouldShowNotificationPrompt()
      ) {
        setShowNotificationPrompt(true);
      }
    }
  }, [isDone]);

  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col bg-white">
      <NotificationPermissionModal
        open={showNotificationPrompt}
        onClose={() => setShowNotificationPrompt(false)}
        onAllow={requestPermission}
      />
      <header className="px-6 pt-6 pb-6">
        <ProgressPips total={deckSize} completed={completed} />
        {hydrated && <DeckTasteLabel historyCount={historyCount} />}
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6">
        {!hydrated ? (
          <p className="text-black/40">Loading your deck…</p>
        ) : isDone ? (
          <DeckComplete />
        ) : (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            {next && (
              <SwipeCard
                piece={next}
                className="scale-[0.96] opacity-60"
                style={{ zIndex: 0 }}
              />
            )}

            {current && (
              <div
                className="absolute inset-0 z-10"
                style={{
                  transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                  opacity,
                  transition: isDragging
                    ? "none"
                    : "transform 220ms ease-out, opacity 220ms ease-out",
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
              >
                <SwipeCard piece={current} dragLabel={dragLabel} />
              </div>
            )}
          </div>
        )}
      </div>

      {hydrated && !isDone && current && (
        <footer className="px-6 pb-10">
          <SwipeActions
            onPass={handlePass}
            onSave={handleSave}
            disabled={isExiting}
          />
        </footer>
      )}
    </main>
  );
}
