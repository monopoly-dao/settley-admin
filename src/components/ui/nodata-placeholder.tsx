import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '@/components/ui';

type Props = {
  retryHandler?(): void;
  actionHandler?(): void;
  label?: string;
  isLoading?: boolean;
  buttonLabel?: string;
  className?: string;
  btnBrops?: ButtonProps;
  description?: string;
  innerMaxWidth?: string;
};

export function NoDataPlaceholder({
  actionHandler,
  label,
  isLoading,
  buttonLabel,
  className,
  btnBrops,
  description,
  innerMaxWidth,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        'w-full flex flex-col gap-4 items-center justify-center px-6 py-6 min-h-[250px] border border-divider-primary rounded-[12px]',
        className,
      )}
      {...rest}
    >
      <div className={cn('flex flex-col items-center justify-center gap-2')}>
        {/* <ClockIcon /> */}

        <div
          className={cn(
            'w-full flex flex-col gap-2',
            innerMaxWidth ?? 'max-w-[310px]',
          )}
        >
          <h1 className='font-bold text-[16px] text-center'>
            {label ?? 'Nothing to see here'}
          </h1>
          <p className={cn('text-center')}>{description}</p>
        </div>
      </div>

      {!!actionHandler && (
        <Button
          {...btnBrops}
          onClick={actionHandler}
          isLoading={isLoading}
          className='w-[148px] !text-[14px]'
        >
          {buttonLabel ?? 'Retry'}
        </Button>
      )}
    </div>
  );
}
