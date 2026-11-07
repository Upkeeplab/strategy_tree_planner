import React from "react";
import { Link } from "react-router-dom";
import Footer from "../src/components/Footer";


export default function Guide(){
  return (
    <div className="guide-page">
      <header>
        <h1
          style={{
            fontSize: "30px",
            fontFamily: "Arial, Helvetica, sans-serif",
            letterSpacing: "5px",
          }}
        >
          Strategy Planner :: Guide
        </h1>

        <div className="toolbar">
          <Link to="/">Back</Link>
        </div>
      </header>

      <div className="note">
        <strong>Table of Contents</strong>
        <ul>
          <li><a href="#core-philosophy">Core Philosophy</a></li>
          <li><a href="#basic-structure">Basic Structure</a></li>
          <li><a href="#relationship-tags">Strategic Relationship Tags</a></li>
          <li><a href="#workflow">Recommended Workflow</a></li>
          <li><a href="#keyboard-shortcuts">Keyboard shortcuts ★</a></li>
          <li><a href="#exporting">Exporting</a></li>
          <li><a href="#privacy">Privacy</a></li>
        </ul>
      </div>

      <p>
        Strategy Planner is a lightweight local-first planning tool for
        structured strategic thinking. It combines hierarchical planning,
        military-style operational logic, and decision-tree semantics
        inside a simple text-based system.
      </p>

      <div className="note">
        The app is designed for fast thinking, not project management.
        It focuses on goals, alternatives, dependencies, sequencing,
        and strategic reasoning.
      </div>

      <h2 id="core-philosophy">Core Philosophy</h2>

      <p>
        Most planning tools only support parent-child hierarchy.
        This app supports richer strategic relationships:
      </p>

      <ul>
        <li>Hierarchy</li>
        <li>Dependencies</li>
        <li>Mutually exclusive alternatives</li>
        <li>Parallel goals</li>
        <li>Sequencing</li>
        <li>Decision points</li>
        <li>Contingencies</li>
      </ul>

      <h2 id="basic-structure">Basic Structure</h2>

      <pre>{`1 Main Goal

    1.1 Intermediate Goal
        - Task
        - Task

    1.2 Intermediate Goal
        - Task`}</pre>

      <h3>Meaning</h3>

      <table>
        <thead>
          <tr>
            <th>Element</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Goal</td>
            <td>Main desired outcome</td>
          </tr>
          <tr>
            <td>Intermediate Goal</td>
            <td>Necessary milestone or capability</td>
          </tr>
          <tr>
            <td>Task</td>
            <td>Concrete action</td>
          </tr>
        </tbody>
      </table>

      <h2 id="relationship-tags">Strategic Relationship Tags</h2>

      <h3><span className="tag">[AND]</span></h3>
      <p>All branches should be pursued simultaneously.</p>

      <pre>{`[AND]
1.1 Build product
1.2 Build audience
1.3 Raise capital`}</pre>

      <h3><span className="tag">[XOR]</span></h3>
      <p>Only one option should ultimately be selected.</p>

      <pre>{`[XOR]
1.1 Subscription model
1.2 Enterprise licensing
1.3 Advertising`}</pre>

      <h3><span className="tag">[OR]</span></h3>
      <p>One or more options may be combined.</p>

      <pre>{`[OR]
1.1 SEO
1.2 Paid ads
1.3 Partnerships`}</pre>

      <h3><span className="tag">[SEQ]</span></h3>
      <p>Order matters.</p>

      <pre>{`[SEQ]
1.1 Research
1.2 Prototype
1.3 Testing
1.4 Launch`}</pre>

      <h2>Decision Points</h2>

      <p>
        Decision Points (DPs) define moments where strategy changes
        depending on conditions.
      </p>

      <pre>{`DP1:
If user growth slows:
    → reduce expansion spending`}</pre>

      <h2>Dependencies</h2>

      <p>Dependencies express prerequisites between goals.</p>

      <pre>{`1.3 depends on → 1.1

1.4 requires → 1.2 and 1.3`}</pre>

      <h2>Risks and Assumptions</h2>

      <h3><span className="tag">[RISK]</span></h3>

      <pre>{`[RISK]
Large competitor enters market`}</pre>

      <h3><span className="tag">[ASSUMPTION]</span></h3>

      <pre>{`[ASSUMPTION]
AI demand continues increasing`}</pre>

      <h2>Branching Logic</h2>

      <p>Branches represent alternative strategic paths.</p>

      <pre>{`[BRANCH]
If funding fails:
    → prioritize profitability`}</pre>

      <h2>Priority Markers</h2>

      <pre>{`[Primary] 1.1 Main strategy
[Secondary] 1.2 Backup strategy

★ 1.3 Preferred option`}</pre>

      <h2>Time Horizons</h2>

      <pre>{`[NOW]
1.1 Research market

[NEXT]
1.2 Build MVP

[LATER]
1.3 International expansion`}</pre>

      <h2 id="workflow">Recommended Workflow</h2>

      <ol>
        <li>Start with one main goal.</li>
        <li>Break it into intermediate goals.</li>
        <li>Define relationships using tags.</li>
        <li>Add dependencies and contingencies.</li>
        <li>Refine and reorganize branches.</li>
        <li>Export to PDF for printing or sharing.</li>
      </ol>

      <h2 id="keyboard-shortcuts">Keyboard shortcuts</h2>

      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>key</code></td>
            <td>
              [AND], [OR], [XOR], [SEQ], [ASSUMPTION],
              [RISK], [CONSTRAINTS], DP, [BRANCH],
              [Primary], [Secondary]
            </td>
          </tr>
          <tr>
            <td><code>status</code></td>
            <td>
              [DRAFT], [ACTIVE], [BLOCKED], [COMPLETE],
              [ABANDONED]
            </td>
          </tr>
          <tr>
            <td><code>time</code></td>
            <td>
              [NOW], [NEXT], [LATER], [FUTURE A],
              [FUTURE B], [FUTURE C]
            </td>
          </tr>
          <tr>
            <td><code>sym</code></td>
            <td>→, ★</td>
          </tr>
          <tr>
            <td><code>today</code></td>
            <td>Prints current date, format: 01/01/2026</td>
          </tr>
          <tr>
            <td><code>tomorrow</code></td>
            <td>Prints tomorrow date, format: 01/01/2026</td>
          </tr>
          <tr>
            <td><code>yesterday</code></td>
            <td>Prints yesterday date, format: 01/01/2026</td>
          </tr>
          <tr>
            <td><code>emoji</code></td>
            <td>🔥, ⚠️, ✅, ❌, 📌, 🚀, ⏳, 💡, 🔒</td>
          </tr>
        </tbody>
      </table>

      <h2 id="exporting">Exporting</h2>

      <p>
        Use the Export PDF button or your browser print function.
      </p>

      <pre>{`File → Print → Save as PDF`}</pre>

      <h2 id="privacy">Privacy</h2>

      <p>
        The app is local-first and designed for private strategic thinking.
        No account or cloud storage is required.
      </p>
      <Footer />
    </div>

  );

}