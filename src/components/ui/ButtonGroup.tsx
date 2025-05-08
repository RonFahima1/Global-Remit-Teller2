import React from 'react';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

interface ButtonGroupProps {
  onCancel?: () => void;
  onReset?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  showReset?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  className?: string;
}

export function ButtonGroup({
  onCancel,
  onReset,
  onSubmit,
  loading = false,
  showReset = true,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  className = '',
}: ButtonGroupProps) {
  return (
    <div className={`flex justify-end space-x-2 ${className}`}>
      {showReset && onReset && (
        <Button
          variant="outline"
          onClick={onReset}
          type="button"
          aria-label={resetLabel}
        >
          {resetLabel}
        </Button>
      )}
      {onCancel && (
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          aria-label={cancelLabel}
        >
          {cancelLabel}
        </Button>
      )}
      {onSubmit && (
        <Button
          type="submit"
          disabled={loading}
          aria-label={submitLabel}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      )}
    </div>
  );
}
