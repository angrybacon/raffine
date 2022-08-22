import type { Text } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { Plugin } from 'unified';
import { selectAll } from 'unist-util-select';
import { visit } from 'unist-util-visit';
import type { Node, Test } from 'unist-util-visit';
import { scry } from '~/scryfall/scry';

const remarkCards: Plugin<[]> = () => (tree, file) => {
  const test: Test = { name: 'row' };
  visit<Node, Test>(tree, test, (node) => {
    if (node.type !== 'containerDirective') {
      file.fail('Directive should be a container', node);
    }
    const directive = node as ContainerDirective;
    const items = selectAll('text', directive) as Text[];
    scry(...items.map((text) => text.value));
  });
};

export const read = (markdown: string) => {
  const tree = unified().use(remarkParse).use(remarkDirective).parse(markdown);
  unified().use(remarkCards).runSync(tree);
};
