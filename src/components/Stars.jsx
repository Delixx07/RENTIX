import Icon from './Icon';

// Renders a 5-star rating row. Filled stars use the amber brand color.
export default function Stars({ value = 0, size = 14 }) {
  const rounded = Math.round(value);
  return (
    <span style={{ display: 'inline-flex', gap: 1, lineHeight: 0 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          size={size}
          strokeWidth={1.5}
          style={{
            color: n <= rounded ? 'var(--amber)' : 'var(--gray-200)',
            fill: n <= rounded ? 'var(--amber)' : 'none',
          }}
        />
      ))}
    </span>
  );
}
