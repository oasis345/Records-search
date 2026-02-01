import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const AccordionCardItem: React.FC<AccordionCardItemProps> = ({
  classes,
  item,
  itemKey,
  header,
  content,
  subContent,
  detail,
}) => {
  const isWin = classes?.includes('border-l-blue') || classes?.includes('win');
  const isLoss = classes?.includes('border-l-red') || classes?.includes('loss');

  return (
    <AccordionItem
      value={itemKey}
      className={`
        rounded-lg overflow-hidden border-0
        ${isWin ? 'bg-blue-500/5 hover:bg-blue-500/10' : ''}
        ${isLoss ? 'bg-red-500/5 hover:bg-red-500/10' : ''}
        ${!isWin && !isLoss ? 'bg-muted/30 hover:bg-muted/50' : ''}
        transition-colors
      `}
    >
      <div className={`${classes} p-2 sm:p-4`}>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* 승패/모드/시간 - 고정 너비 */}
          <div className="w-14 sm:w-20 flex-shrink-0">
            {header}
          </div>

          {/* 메인 컨텐츠 - 유동 */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {content}
          </div>

          {/* 참가자 목록 - lg 이상에서만 */}
          {subContent && (
            <div className="hidden lg:block flex-shrink-0">
              {subContent}
            </div>
          )}

          {/* 상세보기 토글 */}
          {detail && (
            <AccordionTrigger className="flex-shrink-0 p-1 sm:p-2 hover:bg-muted/50 rounded-lg" />
          )}
        </div>
      </div>

      {detail && (
        <AccordionContent className="px-4 pb-4 pt-0">
          <div className="bg-muted/30 rounded-lg p-4">
            {detail}
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};
