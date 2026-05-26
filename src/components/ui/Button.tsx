'use client';

import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type SharedButtonProps = {
  locked?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButtonProps = {
  as?: 'button';
} & SharedButtonProps &
  React.ComponentProps<'button'> &
  MotionProps;

type ButtonAsSpanProps = {
  as: 'span';
} & SharedButtonProps &
  React.ComponentProps<'span'> &
  MotionProps;

type ButtonProps = ButtonAsButtonProps | ButtonAsSpanProps;

const baseClassName =
  'inline-flex items-center justify-center rounded-xl px-5 py-3 font-headings font-semibold shadow-soft transition-colors';

function getButtonClassName(className: string | undefined, locked: boolean | undefined) {
  return cn(
    baseClassName,
    {
      'bg-accent text-white': !locked,
      'bg-neutral-lines text-neutral-slate cursor-not-allowed': locked,
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent disabled:hover:text-white': !locked,
    },
    className
  );
}

function ButtonContent({
  children,
  locked,
}: Pick<SharedButtonProps, 'children' | 'locked'>) {
  return (
    <>
      {children}
      {locked && <Lock className="ml-2 h-4 w-4" />}
    </>
  );
}

export function Button(props: ButtonProps) {
  const hoverAnimation = { scale: props.locked ? 1 : 1.03, y: props.locked ? 0 : -2 };
  const tapAnimation = { scale: props.locked ? 1 : 0.98 };
  const transition = { type: 'spring' as const, stiffness: 400, damping: 17 };

  if (props.as === 'span') {
    const { className, children, locked, ...rest } = props;

    return (
      <motion.span
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={transition}
        className={getButtonClassName(className, locked)}
        {...rest}
      >
        <ButtonContent locked={locked}>{children}</ButtonContent>
      </motion.span>
    );
  }

  const { className, children, locked, disabled, type = 'button', ...rest } = props;
  const isInactive = locked || Boolean(disabled);
  const buttonHoverAnimation = { scale: isInactive ? 1 : 1.03, y: isInactive ? 0 : -2 };
  const buttonTapAnimation = { scale: isInactive ? 1 : 0.98 };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={buttonHoverAnimation}
      whileTap={buttonTapAnimation}
      transition={transition}
      className={getButtonClassName(className, locked)}
      {...rest}
    >
      <ButtonContent locked={locked}>{children}</ButtonContent>
    </motion.button>
  );
}
