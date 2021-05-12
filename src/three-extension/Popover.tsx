import { styled } from './styles/stitches.config';
import * as PopoverPrimitive from '@radix-ui/react-popover';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = styled(PopoverPrimitive.Content, {
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow: '0px 10px 38px -10px hsla(206,22%,7%,.35)',
    overflow: 'hidden',
    '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px hsl(272,100%,96%)',
    },
});
