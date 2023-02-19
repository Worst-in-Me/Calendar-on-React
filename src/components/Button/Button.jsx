import styles from './Button.module.css';
import cn from 'classnames';

export const Button = ({className, children, ...props}) => (
    <div className={cn(styles.button, styles[className])} {...props}>{children}</div>
);