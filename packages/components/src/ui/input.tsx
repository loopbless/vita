import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@vita/components/utils'

const inputVariants = cva('flex w-full rounded-md focus-visible:ring-1 focus-visible:ring-ring shadow-sm', {
  variants: {
    size: {
      default: 'h-9 px-3 py-1',
      sm: 'h-8 px-2 text-xs',
      lg: 'h-10 px-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface InputProps
  extends VariantProps<typeof inputVariants>,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'prefix' | 'suffix'
    > {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, prefix, suffix, ...props }, ref) => {
    const InputNode = React.useMemo(
      () => (
        <input
          type={type}
          className={cn(
            prefix || suffix ? 'peer h-full flex-1' : inputVariants({ size, className }),
            'bg-transparent outline-none text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          )}
          ref={ref}
          {...props}
        />
      ),
      [prefix, suffix]
    )
    return prefix || suffix ? (
      <div
        className={cn(
          inputVariants({ size, className }),
          'items-center px-2 gap-1 relative'
        )}
      >
        {prefix}
        {InputNode}
        {suffix}
        <div className='peer-focus-visible:ring-1 peer-focus-visible:ring-ring border border-input absolute w-full h-full left-0 top-0 rounded-md pointer-events-none' />
      </div>
    ) : (
      InputNode
    )
  }
)
Input.displayName = 'Input'

export { Input }
