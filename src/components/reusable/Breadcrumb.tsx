import React, { useMemo } from 'react';

export type BreadcrumbItem = {
  id?: string | number;
  label: React.ReactNode;
  href?: string;
  to?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode | ((index: number, isLast: boolean) => React.ReactNode);
  maxItems?: number;
  renderItem?: (item: BreadcrumbItem, state: { index: number; isLast: boolean }) => React.ReactNode;
  linkComponent?: React.ComponentType<{ to: string; className?: string; children: React.ReactNode; 'aria-current'?: 'page' }>
  microdata?: boolean;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  linkClassName?: string;
  currentClassName?: string;
  separatorClassName?: string;
  ariaLabel?: string;
};

const DefaultSeparator = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden="true">/</span>
);

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  maxItems,
  renderItem,
  linkComponent: LinkComponent,
  microdata = true,
  className,
  listClassName,
  itemClassName,
  linkClassName,
  currentClassName,
  separatorClassName,
  ariaLabel = 'Breadcrumb'
}) => {
  const { visibleItems, collapsedItems } = useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return { visibleItems: items, collapsedItems: [] };
    };

    const edge = Math.floor((maxItems - 1) / 2);
    return {
      visibleItems: [...items.slice(0, edge), ...items.slice(items.length - edge)],
      collapsedItems: items.slice(edge, items.length - edge)
    };
  }, [items, maxItems]);

  const renderSeparator = (index: number, isLast: boolean) => {
    if (isLast) return null;
    if (typeof separator === 'function') {
      return <span className={separatorClassName}>{separator(index, isLast)}</span>
    };

    if (separator) {
      return <span className={separatorClassName}>{separator}</span>
    }

    return <DefaultSeparator className={separatorClassName} />
  };

  const renderDefaultItem = (item: BreadcrumbItem, isLast: boolean) => {
    const content = (
      <>
        {item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </>
    );

    const commonProps = {
      className: `${linkClassName ?? ''} ${isLast ? currentClassName ?? '' : ''}`.trim(),
      'aria-current': isLast ? ('page' as const) : undefined
    };

    if (item.disabled || isLast) {
      return <span {...commonProps}>{content}</span>;
    }

    if (LinkComponent && item.to) {
      return <LinkComponent to={item.to} {...commonProps}>{content}</LinkComponent>
    }

    return (
      <a href={item.href} onClick={item.onClick} aria-label={item.ariaLabel} {...commonProps}>
        {content}
      </a>
    )
  };

  const listProps = microdata
    ? { itemScope: true, itemType: 'https://schema.org/BreadcrumbList' }
    : {};

  const itemProps = microdata
    ? { itemProp: 'itemListElement', itemScope: true, itemType: 'https://schema.org/ListItem' }
    : {};

  const nameProps = microdata ? { itemProp: 'name' } : {};
  const linkProps = microdata ? { itemProp: 'item' } : {};

  let positionCounter = 1;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className={listClassName} {...listProps}>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const key = item.id ?? `${index}-${String(item.label)}`;

          const content = renderItem
            ? renderItem(item, { index, isLast })
            : renderDefaultItem(item, isLast);

          return (
            <li key={key} className={itemClassName} {...itemProps}>
              {microdata ? (
                <>
                  {item.href || item.to ? (
                    <a href={item.href} {...linkProps} className={linkClassName}>
                      <span {...nameProps}>{item.label}</span>
                    </a>
                  ) : (
                    <span className={currentClassName}>
                      <span {...nameProps}>{item.label}</span>
                    </span>
                  )}
                  <meta itemProp="position" content={String(positionCounter++)} />
                </>
              ) : (
                content
              )}
              {renderSeparator(index, isLast)}
            </li>
          )
        })}

        {collapsedItems.length > 0 && (
          <li className={itemClassName}>
            <details>
              <summary style={{ cursor: 'pointer' }}>_</summary>
              <ol className="d-inline">
                {collapsedItems.map((item, i) => {
                  const key = item.id ?? `collapsed-${i}`;
                  return (
                    <li key={key} className={itemClassName}>
                      {renderItem
                        ? renderItem(item, { index: i, isLast: false })
                        : renderDefaultItem(item, false)
                      }
                      {i < collapsedItems.length - 1 && renderSeparator(i, false)}
                    </li>
                  )
                })}
              </ol>
            </details>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;