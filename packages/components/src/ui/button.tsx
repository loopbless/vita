import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { debounce } from 'lodash'

import { cn } from '@vita/components/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const [pending, setPending] = React.useState(false)
    const setCachePending = debounce(setPending, 750, {})
    React.useEffect(() => {
      loading ? setPending(loading) : setCachePending(loading)
    }, [loading])
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {!asChild && (loading || pending) ? (
          <svg
            height='1.5em'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 28 24'
            fill='currentColor'
          >
            <rect
              width='6'
              rx='2'
              ry='2'
              height='14'
              x='1'
              y='4'
            >
              <animate
                id='btnSpinner0'
                fill='freeze'
                attributeName='y'
                begin='0;btnSpinner1.end-0.25s'
                dur='0.75s'
                values='1;5'
              ></animate>
              <animate
                fill='freeze'
                attributeName='height'
                begin='0;btnSpinner1.end-0.25s'
                dur='0.75s'
                values='22;14'
              ></animate>
              <animate
                fill='freeze'
                attributeName='opacity'
                begin='0;btnSpinner1.end-0.25s'
                dur='0.75s'
                values='1;.2'
              ></animate>
            </rect>
            <rect
              width='6'
              rx='2'
              ry='2'
              height='14'
              x='11'
              y='4'
              opacity='.4'
            >
              <animate
                fill='freeze'
                attributeName='y'
                begin='btnSpinner0.begin+0.15s'
                dur='0.75s'
                values='1;5'
              ></animate>
              <animate
                fill='freeze'
                attributeName='height'
                begin='btnSpinner0.begin+0.15s'
                dur='0.75s'
                values='22;14'
              ></animate>
              <animate
                fill='freeze'
                attributeName='opacity'
                begin='btnSpinner0.begin+0.15s'
                dur='0.75s'
                values='1;.2'
              ></animate>
            </rect>
            <rect
              width='6'
              rx='2'
              ry='2'
              height='14'
              x='21'
              y='4'
              opacity='.3'
            >
              <animate
                id='btnSpinner1'
                fill='freeze'
                attributeName='y'
                begin='btnSpinner0.begin+0.3s'
                dur='0.75s'
                values='1;5'
              ></animate>
              <animate
                fill='freeze'
                attributeName='height'
                begin='btnSpinner0.begin+0.3s'
                dur='0.75s'
                values='22;14'
              ></animate>
              <animate
                fill='freeze'
                attributeName='opacity'
                begin='btnSpinner0.begin+0.3s'
                dur='0.75s'
                values='1;.2'
              ></animate>
            </rect>
          </svg>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
