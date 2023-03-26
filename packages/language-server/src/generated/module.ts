/******************************************************************************
 * This file was generated by langium-cli 1.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import { LangiumGeneratedServices, LangiumGeneratedSharedServices, LangiumSharedServices, LangiumServices, LanguageMetaData, Module, IParserConfig } from 'langium';
import { LikeC4AstReflection } from './ast';
import { LikeC4Grammar } from './grammar';

export const LikeC4LanguageMetaData: LanguageMetaData = {
    languageId: 'likec4',
    fileExtensions: ['.lkc4', '.likec4', '.like-c4'],
    caseInsensitive: false
};

export const parserConfig: IParserConfig = {
    recoveryEnabled: true,
    nodeLocationTracking: 'full',
};

export const LikeC4GeneratedSharedModule: Module<LangiumSharedServices, LangiumGeneratedSharedServices> = {
    AstReflection: () => new LikeC4AstReflection()
};

export const LikeC4GeneratedModule: Module<LangiumServices, LangiumGeneratedServices> = {
    Grammar: () => LikeC4Grammar(),
    LanguageMetaData: () => LikeC4LanguageMetaData,
    parser: {
        ParserConfig: () => parserConfig
    }
};
