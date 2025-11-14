import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '@/components/ui/button';

type Props = {
  className?: string;
  retryHandler?(): void;
  errorMessage?: string;
  isLoading?: boolean;
  subActionHandler?(): void;
  subActionBtnLabel?: string;
  buttonLabel?: string;
  btnProps?: ButtonProps;
};

export function ErrorPlaceholder({
  className,
  errorMessage,
  retryHandler,
  btnProps,
  isLoading,
  buttonLabel,
  subActionHandler,
  subActionBtnLabel,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        'w-full flex flex-col gap-4 items-center justify-center px-6 py-8 min-h-[250px] rounded-2xl border border-red-200 bg-red-50',
        className,
      )}
      {...rest}
    >
      {/* Icon */}
      <AlertCircle className='h-10 w-10 text-red-500' />

      {/* Text */}
      <div className='flex flex-col items-center gap-1 text-center'>
        <h1 className='font-semibold text-lg text-red-600'>
          {errorMessage ?? 'Something went wrong'}
        </h1>
        <p className='text-sm text-gray-600'>
          Please try again or refresh the page.
        </p>
      </div>

      {/* Actions */}
      <div className='flex gap-3'>
        {retryHandler && (
          <Button
            {...btnProps}
            onClick={retryHandler}
            isLoading={isLoading}
            className='w-[148px] text-[14px]'
          >
            {buttonLabel || 'Try Again'}
          </Button>
        )}

        {subActionHandler && (
          <Button
            variant='outline'
            onClick={subActionHandler}
            className='w-[148px] text-[14px]'
          >
            {subActionBtnLabel || 'Cancel'}
          </Button>
        )}
      </div>
    </div>
  );
}
