import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  IconArrowBarToLeft,
  IconCarambola,
  IconCaretLeft,
  IconCaretRight,
  IconChevronCompactDown,
  IconFoldDown,
  IconHeart,
  IconMinus,
  IconPlus,
  IconStar,
  IconToggleRight,
  IconWindowMinimize,
  IconX,
} from '@tabler/icons-react';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <div className="main-content"></div>
      <div className="slide-out-wrapper">
        <div className="slide-out-inner">
          <div className="slide-out-trigger-actions">
            <button className="slide-out-trigger-btn" type="button">
              <span className="sr-only">Hide slide-out modal</span>
              <IconFoldDown />
            </button>
            <button className="slide-out-trigger-btn" type="button">
              <span className="sr-only">Close slide-out modal</span>
              <IconWindowMinimize />
            </button>
            <button className="slide-out-trigger-btn" type="button">
              <span className="sr-only">Close slide-out modal</span>
              <IconX />
            </button>
          </div>

          <div className="slide-out-content">
            {/*<!-- Zoom Controller (Right) -->*/}
            <div className="zoom-controller-bar">
              <button className="zoom-btn zoom-in" type="button">
                <span className="sr-only">Zoom in</span>
                <IconPlus />
              </button>
              <label className="sr-only" htmlFor="zoom-slider">
                Zoom
              </label>
              <input
                className="zoom-slider"
                id="zoom-slider"
                max="150"
                min="50"
                type="range"
                value="100"
                onChange={($event) => console.log($event.target.value)}
              />
              <button className="zoom-btn zoom-out" type="button">
                <span className="sr-only">Zoom out</span>
                <IconMinus />
              </button>
            </div>

            {/*<!-- Gallery Slider (Up from bottom with trigger button) -->*/}
            <div className="gallery-slider">
              <button type="button" className="gallery-toggle-btn">
                <span></span>
                <IconChevronCompactDown />
              </button>
              <button type="button" className="gallery-nav prev">
                <span className="sr-only">Slider scroll left</span>
                <IconCaretLeft />
              </button>
              <div className="gallery-slider-list">
                {/*<!-- Placeholder with divs if 200 x 200 px-->*/}
                <img
                  className="thumbnail active"
                  src="https://placehold.co/200x200/000000/FFFF00"
                  alt="Image 1"
                />
                <img
                  className="thumbnail"
                  src="https://placehold.co/200x200/000000/FFF"
                  alt="Image 2"
                />
                <img
                  className="thumbnail"
                  src="https://placehold.co/200x200/000000/00A36C"
                  alt="Image 3"
                />
              </div>
              <button type="button" className="gallery-nav next">
                <span className="sr-only">Slider scroll right</span>
                <IconCaretRight />
              </button>
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-content">
              <div className="sidebar-actions">
                <button type="button">
                  <span className="sr-only">Move sidebar to the left</span>
                  <IconArrowBarToLeft />
                </button>
                <button className="minimize-sidebar" type="button">
                  <span className="sr-only">Minimize sidebar</span>
                  <IconToggleRight />
                </button>
              </div>

              <div className="post-info">
                <div className="section-title">DETAILS</div>
                <div className="list-items">
                  <div className="item">
                    <div className="item-label">
                      <span>Post ID</span>
                    </div>
                    <div className="item-value">
                      <span>1234567890</span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="item-label">
                      <span>File Type</span>
                    </div>
                    <div className="item-value">
                      <span>image/jpg</span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="item-label">
                      <span>File size</span>
                    </div>
                    <div className="item-value">
                      <span>2.02 MB</span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="item-label">
                      <span>Uploader</span>
                    </div>
                    <div className="item-value">
                      <a href="#">quangdd1202</a>
                    </div>
                  </div>
                  <div className="item">
                    <div className="item-label">
                      <span>Uploaded at</span>
                    </div>
                    <div className="item-value">
                      <span>Feb 10, 2025</span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="item-label">
                      <span>Rating</span>
                    </div>
                    <div className="item-value">
                      <span>G</span>
                    </div>
                  </div>
                </div>

                <div className="post-list-tags">
                  <div className="section-title">TAGS</div>
                  <div className="list-items">
                    <div className="item">
                      <div className="flex">
                        <button className="tag-follow" type="button">
                          <span className="sr-only">Follow tag</span>
                          <IconCarambola />
                        </button>
                        <button className="tag-pill" type="button">
                          <span className="tag-name">
                            Blue Archive Blue Archive Blue Archive Blue Archive Blue Archive
                          </span>
                        </button>
                      </div>
                      <a className="tag-post-count" href="#">
                        <span> 2002</span>
                      </a>
                    </div>
                    <div className="item">
                      <button className="tag-follow" type="button">
                        <span className="sr-only">Unfollow tag</span>
                        <IconCarambola />
                      </button>
                      <button className="tag-pill" type="button">
                        <span className="tag-name">
                          Blue Archive Blue Archive Blue Archive Blue Archive Blue Archive
                        </span>
                      </button>
                      <a className="tag-post-count" href="#">
                        <span> 2002</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-bottom">
              <div className="post-actions">
                <button className="post-like-btn" type="button">
                  <span className="sr-only">Like post</span>
                  <IconHeart />
                </button>
                <div className="post-vote">
                  <IconStar />
                  <IconStar />
                  <IconStar />
                  <IconStar />
                  <IconStar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
