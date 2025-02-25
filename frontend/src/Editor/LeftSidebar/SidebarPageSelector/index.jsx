import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { LeftSidebarItem } from '../SidebarItem';
import { Button, HeaderSection } from '@/_ui/LeftSidebar';
import { PageHandler, AddingPageHandler } from './PageHandler';
import { GlobalSettings } from './GlobalSettings';
import _ from 'lodash';
import SortableList from '@/_components/SortableList';
import Popover from '@/_ui/Popover';
// eslint-disable-next-line import/no-unresolved
import EmptyIllustration from '@assets/images/no-results.svg';

const LeftSidebarPageSelector = ({
  appDefinition,
  selectedSidebarItem,
  setSelectedSidebarItem,
  darkMode,
  currentPageId,
  addNewPage,
  switchPage,
  deletePage,
  renamePage,
  clonePage,
  hidePage,
  unHidePage,
  updateHomePage,
  updatePageHandle,
  pages,
  homePageId,
  showHideViewerNavigationControls,
  updateOnSortingPages,
  updateOnPageLoadEvents,
  currentState,
  apps,
  popoverContentHeight,
  isVersionReleased,
  setReleasedVersionPopupState,
}) => {
  const [allpages, setPages] = useState(pages);
  const [pinned, setPinned] = useState(false);
  const [haveUserPinned, setHaveUserPinned] = useState(false);

  const [newPageBeingCreated, setNewPageBeingCreated] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const filterPages = (value) => {
    if (!value || value.length === 0) return clearSearch();

    const fuse = new Fuse(pages, { keys: ['name'], threshold: 0.3 });
    const result = fuse.search(value);
    setPages(result.map((item) => item.item));
  };

  const clearSearch = () => {
    setPages(pages);
  };

  React.useEffect(() => {
    if (!_.isEqual(pages, allpages)) {
      setPages(pages);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({ pages })]);

  const pinPagesPopover = (state) => {
    if (!haveUserPinned) {
      setPinned(state);
    }
  };

  const popoverContent = (
    <div>
      <div className="card-body p-0 pb-5">
        <HeaderSection darkMode={darkMode}>
          <HeaderSection.PanelHeader
            title="Pages"
            settings={
              <GlobalSettings
                darkMode={darkMode}
                showHideViewerNavigationControls={showHideViewerNavigationControls}
                showPageViwerPageNavitation={appDefinition?.showViewerNavigation || false}
                isVersionReleased={isVersionReleased}
                setReleasedVersionPopupState={setReleasedVersionPopupState}
              />
            }
          >
            <div className="d-flex justify-content-end">
              <Button
                title={'Add Page'}
                onClick={() => {
                  if (isVersionReleased) {
                    setReleasedVersionPopupState();
                    return;
                  }
                  setNewPageBeingCreated(true);
                }}
                darkMode={darkMode}
                size="sm"
                styles={{ width: '28px', padding: 0 }}
              >
                <Button.Content dataCy={`add-page`} iconSrc={'assets/images/icons/plus.svg'} direction="left" />
              </Button>
              <Button
                title={'Search'}
                onClick={() => setShowSearch(!showSearch)}
                darkMode={darkMode}
                size="sm"
                styles={{ width: '28px', padding: 0 }}
              >
                <Button.Content dataCy={'search-page'} iconSrc={'assets/images/icons/search.svg'} direction="left" />
              </Button>
              <Button
                title={`${pinned ? 'Unpin' : 'Pin'}`}
                onClick={() => {
                  setPinned(!pinned);
                  !haveUserPinned && setHaveUserPinned(true);
                }}
                darkMode={darkMode}
                size="sm"
                styles={{ width: '28px', padding: 0 }}
              >
                <Button.Content
                  dataCy={'pin-panel'}
                  iconSrc={`assets/images/icons/editor/left-sidebar/pinned${pinned ? 'off' : ''}.svg`}
                  direction="left"
                />
              </Button>
            </div>
          </HeaderSection.PanelHeader>
          {showSearch && (
            <HeaderSection.SearchBoxComponent
              onChange={filterPages}
              placeholder={'Search'}
              placeholderIcon={''}
              darkMode={darkMode}
            />
          )}
        </HeaderSection>

        <div className={`${darkMode && 'dark'} page-selector-panel-body`}>
          <div>
            {allpages.length > 0 ? (
              <SortableList
                data={allpages}
                Element={PageHandler}
                pages={allpages}
                darkMode={darkMode}
                switchPage={switchPage}
                deletePage={deletePage}
                renamePage={renamePage}
                clonePage={clonePage}
                hidePage={hidePage}
                unHidePage={unHidePage}
                homePageId={homePageId}
                currentPageId={currentPageId}
                updateHomePage={updateHomePage}
                updatePageHandle={updatePageHandle}
                classNames="page-handler"
                onSort={updateOnSortingPages}
                updateOnPageLoadEvents={updateOnPageLoadEvents}
                currentState={currentState}
                apps={apps}
                allpages={pages}
                components={appDefinition?.components ?? {}}
                isVersionReleased={isVersionReleased}
                setReleasedVersionPopupState={setReleasedVersionPopupState}
                pinPagesPopover={pinPagesPopover}
                haveUserPinned={haveUserPinned}
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <div>
                  <EmptyIllustration />
                  <p data-cy={`label-no-pages-found`} className="mt-3">
                    No pages found
                  </p>
                </div>
              </div>
            )}

            {newPageBeingCreated && (
              <div className="page-handler">
                <AddingPageHandler
                  addNewPage={addNewPage}
                  setNewPageBeingCreated={setNewPageBeingCreated}
                  switchPage={switchPage}
                  darkMode={darkMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      handleToggle={(open) => {
        if (!open) setSelectedSidebarItem('');
      }}
      {...(pinned && { open: true })}
      popoverContentClassName="p-0 sidebar-h-100-popover"
      side="right"
      popoverContent={popoverContent}
      popoverContentHeight={popoverContentHeight}
    >
      <LeftSidebarItem
        selectedSidebarItem={selectedSidebarItem}
        onClick={() => setSelectedSidebarItem('page')}
        icon="page"
        className={`left-sidebar-item left-sidebar-layout left-sidebar-page-selector`}
        tip="Pages"
      />
    </Popover>
  );
};

export default LeftSidebarPageSelector;
