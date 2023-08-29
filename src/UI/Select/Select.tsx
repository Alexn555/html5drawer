import { FC } from 'react';
import styles from './Select.module.scss';
import { SelectAttributes } from './constants/select';

const Select: FC<SelectAttributes> = (props: SelectAttributes) => {
    const { id, selected, cb, content } = props;
    return (
      <select
        className={styles.select}
        key={id}
        value={selected} 
        onChange={e => cb(e.target.value)}
      >
        {content.map((item) => {
        return (
            <option key={item.value} value={item.value}>
                {item.name}
            </option>
        )})}
      </select>
    );
}

export default Select;