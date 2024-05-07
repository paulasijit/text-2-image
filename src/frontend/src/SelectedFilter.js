import * as React from 'react';
import PropTypes from 'prop-types';
import { Select as BaseSelect, selectClasses } from '@mui/base/Select';
import { Option as BaseOption, optionClasses } from '@mui/base/Option';
import { styled } from '@mui/system';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';

export default function UnstyledSelectForm({ title, data, func, selected=null }) {
    const [value, setValue] = React.useState(selected);
    const action = React.useRef(null);
    if (typeof func === "function") {
        func(value);
    }

    console.log(value, 888)

    return (
        <form>
            <Label htmlFor={`${title}-select-${data.length}`}>
                {title}
            </Label>
            <Select action={action}
                value={value} id="named-select" name="demo-select" onChange={(e, newValue) => setValue(newValue)} >
                {data.map((item, index) => {
                    return <Option value={item} key={`${index}-${item}`}>{item}</Option>
                })}
            </Select>
        </form>
    );
}

const Select = React.forwardRef(function CustomSelect(props, ref) {
    const slots = {
        root: Button,
        listbox: Listbox,
        popup: Popup,
        ...props.slots,
    };

    return <BaseSelect {...props} ref={ref} slots={slots} />;
});

const blue = {
    100: '#DAECFF',
    200: '#99CCF3',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Button = React.forwardRef(function Button(props, ref) {
    const { ownerState, ...other } = props;
    return (
        <StyledButton type="button" {...other} ref={ref}>
            {other.children}
            <UnfoldMoreRoundedIcon />
        </StyledButton>
    );
});

Button.propTypes = {
    children: PropTypes.node,
    ownerState: PropTypes.object.isRequired,
};

const StyledButton = styled('button', { shouldForwardProp: () => true })(
    () => `
  position: relative;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-width: 320px;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
  line-height: 1.5;
  background: ${grey[900]};
  border: 1px solid ${grey[700]};
  color: ${grey[300]};
  box-shadow: 0px 2px 6px ${'rgba(0,0,0, 0.50)'
        };

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${grey[800]};
    border-color: ${grey[600]};
  }

  &.${selectClasses.focusVisible} {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${blue[600]};
  }

  & > svg {
    font-size: 1rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `,
);

const Listbox = styled('ul')(
    () => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 320px;
  border-radius: 12px;
  overflow: auto;
  max-height: 300px;
  outline: 0px;
  background: ${grey[900]};
  border: 1px solid ${grey[700]};
  color: ${grey[300]};
  box-shadow: 0px 2px 6px ${'rgba(0,0,0, 0.50)'
        };
  `,
);

const Option = styled(BaseOption)(
    () => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${blue[900]};
    color: ${blue[100]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${grey[800]};
    color: ${grey[300]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${blue[900]};
    color: ${blue[100]};
  }

  &:focus-visible {
    outline: 3px solid ${blue[600]};
  }

  &.${optionClasses.disabled} {
    color: ${grey[700]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${grey[800]};
    color: ${grey[300]};
  }
  `,
);

const Popup = styled('div')`
  z-index: 1;
`;

const Label = styled('label')(
    () => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.85rem;
  display: block;
  margin-bottom: 4px;
  font-weight: 400;
  color: ${grey[400]};
  `,
);