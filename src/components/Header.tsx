import { Link } from '@tanstack/react-router';
import * as React from 'react';
import { IconCloudUp, IconDownload, IconUser } from '@tabler/icons-react';

export default function Header() {
  return (
    <div className="header">
      <Logo />
      <Links />
      <Search />
      <Actions />
    </div>
  );
}

function Logo() {
  return (
    <Link
      to={'/'}
      activeProps={{
        className: '',
      }}
    >
      <svg
        className="header-logo"
        fill="none"
        height="40"
        viewBox="0 0 82 40"
        width="82"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M73.365 19.71c0 2.904-2.241 5.31-5.27 5.31-3.03 0-5.228-2.406-5.228-5.31 0-2.905 2.199-5.312 5.228-5.312s5.27 2.407 5.27 5.311Z"
          fill="#FFD43D"
        ></path>
        <path
          d="M48.764 19.544c0 2.946-2.323 5.145-5.27 5.145-2.904 0-5.227-2.2-5.227-5.145 0-2.947 2.323-5.104 5.228-5.104 2.946 0 5.27 2.158 5.27 5.104Z"
          fill="#FF0C81"
        ></path>
        <path
          d="M20.074 25.02c3.029 0 5.27-2.406 5.27-5.31 0-2.905-2.241-5.312-5.27-5.312-3.03 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312Z"
          fill="#11EEFC"
        ></path>
        <path
          d="M68.095 30.54c-6.307 0-11.12-4.897-11.12-10.872 0-5.934 4.855-10.83 11.12-10.83 6.349 0 11.162 4.938 11.162 10.83 0 5.975-4.855 10.871-11.162 10.871Zm0-5.52c3.03 0 5.27-2.406 5.27-5.31 0-2.905-2.24-5.312-5.27-5.312-3.029 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312ZM43.08 40c-4.813 0-8.506-2.116-10.373-5.934l4.896-2.655c.913 1.784 2.614 3.195 5.394 3.195 3.486 0 5.85-2.448 5.85-6.473v-.374c-1.12 1.411-3.111 2.49-6.016 2.49-5.768 0-10.373-4.481-10.373-10.581 0-5.934 4.813-10.788 11.12-10.788 6.431 0 11.162 4.605 11.162 10.788v8.299C54.74 35.27 49.76 40 43.08 40Zm.415-15.311c2.946 0 5.27-2.2 5.27-5.145 0-2.947-2.324-5.104-5.27-5.104-2.905 0-5.228 2.158-5.228 5.104s2.323 5.145 5.228 5.145ZM20.074 30.54c-6.307 0-11.12-4.897-11.12-10.872 0-5.934 4.854-10.83 11.12-10.83 6.348 0 11.162 4.938 11.162 10.83 0 5.975-4.855 10.871-11.162 10.871Zm0-5.52c3.029 0 5.27-2.406 5.27-5.31 0-2.905-2.241-5.312-5.27-5.312-3.03 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312ZM0 0h5.892v30H0V0ZM82 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
          fill="#ffffff"
        ></path>
      </svg>
    </Link>
  );
}

function Links() {
  return (
    <nav className="header-links">
      <Link
        to={'/recommended'}
        activeProps={{
          className: 'active',
        }}
      >
        Recommended
      </Link>
      <Link
        to={'/popular'}
        activeProps={{
          className: 'active',
        }}
      >
        Popular
      </Link>
      <Link
        to={'/explore'}
        activeProps={{
          className: 'active',
        }}
      >
        Explore
      </Link>
    </nav>
  );
}

function Search() {
  return (
    <div className="header-search">
      <label htmlFor="header-search-input"></label>
      <input id="header-search-input" placeholder="Search tags, post_id,..." type="text" />

      {/*<div className="popover-wrapper">
          <div className="popover-content search-focussed">
            <div className="search-suggestion">
              <a className="placeholder list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
              <a className="list-item" href="#">
                No results found.
              </a>
            </div>
          </div>
        </div>*/}
    </div>
  );
}

function Actions() {
  return (
    <div className="header-actions">
      <button type="button">
        <span className="sr-only">Open Download popup</span>
        <IconDownload />
      </button>

      {/*<div className="popover-wrapper">
          <div className="popover-content">
            <div className="download-list-items">
              &lt;!&ndash; Queued &ndash;&gt;
              <div className="download-item queued">
                <div className="file-icon">📄</div>
                <div className="details">
                  <div className="filename">example-file.zip</div>
                  <div className="status">Queued...</div>
                </div>
                <div className="actions">
                  <button className="cancel">✖</button>
                </div>
              </div>
              &lt;!&ndash; Downloading &ndash;&gt;
              <div className="download-item downloading">
                <div className="file-icon">📄</div>
                <div className="details">
                  <div className="filename">large-video.mp4</div>
                  <div className="status">Downloading... 45%</div>
                  <div className="progress-bar">
                    <div className="progress" style="width: 45%;"></div>
                  </div>
                </div>
                <div className="actions">
                  <button className="pause">⏸</button>
                  <button className="cancel">✖</button>
                </div>
              </div>
              &lt;!&ndash; Downloaded &ndash;&gt;
              <div className="download-item downloaded">
                <div className="file-icon">📄</div>
                <div className="details">
                  <div className="filename">report.pdf</div>
                  <div className="status">Completed</div>
                </div>
                <div className="actions">
                  <button className="open">📂</button>
                  <button className="delete">🗑</button>
                </div>
              </div>
              &lt;!&ndash; Error &ndash;&gt;
              <div className="download-item error">
                <div className="file-icon">📄</div>
                <div className="details">
                  <div className="filename">broken-file.iso</div>
                  <div className="status">Download Failed</div>
                </div>
                <div className="actions">
                  <button className="retry">🔄</button>
                  <button className="delete">🗑</button>
                </div>
              </div>
            </div>
          </div>
          <div className="popover-bottom">
            <button type="button">
              <span>Open downloads page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l14 0" />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </svg>
            </button>
          </div>
        </div>*/}

      <button type="button">
        <span className="sr-only">Open Upload to cloud popup</span>
        <IconCloudUp />
      </button>
      <button type="button">
        <span className="sr-only">Navigate to account page</span>
        <IconUser />
      </button>
    </div>
  );
}
