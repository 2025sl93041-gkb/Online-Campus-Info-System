"""
Generate all block diagrams as PNG images for the Online Campus Info System docs.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

COLORS = {
    'primary': '#1976D2',
    'primary_light': '#BBDEFB',
    'secondary': '#388E3C',
    'secondary_light': '#C8E6C9',
    'accent': '#FF8F00',
    'accent_light': '#FFF3E0',
    'purple': '#7B1FA2',
    'purple_light': '#E1BEE7',
    'teal': '#00796B',
    'teal_light': '#B2DFDB',
    'red': '#D32F2F',
    'red_light': '#FFCDD2',
    'gray_bg': '#F5F5F5',
    'white': '#FFFFFF',
    'dark': '#212121',
    'muted': '#757575',
    'border': '#BDBDBD',
}


def save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"Saved: {path}")


def draw_box(ax, x, y, w, h, label, sublabel=None, facecolor='#BBDEFB', edgecolor='#1976D2',
             fontsize=10, bold=False, radius=0.05):
    box = FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0.01,rounding_size={radius}",
                         facecolor=facecolor, edgecolor=edgecolor, linewidth=1.5, zorder=3)
    ax.add_patch(box)
    weight = 'bold' if bold else 'normal'
    cy = y + h / 2
    if sublabel:
        ax.text(x + w / 2, cy + h * 0.12, label, ha='center', va='center',
                fontsize=fontsize, fontweight=weight, color=COLORS['dark'], zorder=4)
        ax.text(x + w / 2, cy - h * 0.15, sublabel, ha='center', va='center',
                fontsize=fontsize - 1.5, color=COLORS['muted'], zorder=4)
    else:
        ax.text(x + w / 2, cy, label, ha='center', va='center',
                fontsize=fontsize, fontweight=weight, color=COLORS['dark'], zorder=4)


def draw_arrow(ax, x1, y1, x2, y2, label='', color='#555555'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.8),
                zorder=5)
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx + 0.02, my, label, fontsize=7.5, color=color, ha='left', va='center', zorder=6)


# ─────────────────────────────────────────────────────────────────
# 1. High-Level Architecture
# ─────────────────────────────────────────────────────────────────
def gen_high_level():
    fig, ax = plt.subplots(figsize=(13, 9))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')
    ax.set_title('High-Level System Architecture', fontsize=16, fontweight='bold',
                 color=COLORS['dark'], pad=14)

    # ── CLIENT LAYER ──
    client_outer = FancyBboxPatch((0.3, 6.0), 12.4, 2.7,
                                  boxstyle="round,pad=0.05,rounding_size=0.15",
                                  facecolor='#E3F2FD', edgecolor=COLORS['primary'], linewidth=2, zorder=1)
    ax.add_patch(client_outer)
    ax.text(0.7, 8.45, 'CLIENT LAYER', fontsize=9, fontweight='bold', color=COLORS['primary'])

    inner_bg = FancyBboxPatch((0.6, 6.15), 11.8, 2.25,
                               boxstyle="round,pad=0.03,rounding_size=0.1",
                               facecolor='#BBDEFB', edgecolor=COLORS['primary'], linewidth=1, zorder=2)
    ax.add_patch(inner_bg)
    ax.text(6.5, 8.12, 'React JS Frontend (SPA)', ha='center', fontsize=10, fontweight='bold',
            color=COLORS['dark'])

    pages = [
        ('Auth\nPages', 1.0),
        ('College\nPages', 3.5),
        ('Student\nPages', 6.0),
        ('Reports\nPages', 8.5),
    ]
    for lbl, px in pages:
        draw_box(ax, px, 6.35, 2.2, 1.45, lbl, facecolor=COLORS['white'],
                 edgecolor=COLORS['primary'], fontsize=9)

    # ── ARROW ──
    ax.annotate('', xy=(6.5, 5.85), xytext=(6.5, 6.0),
                arrowprops=dict(arrowstyle='<->', color=COLORS['muted'], lw=2.0))
    ax.text(6.52, 5.93, 'HTTP/HTTPS  ·  REST API (JSON)', fontsize=8, color=COLORS['muted'],
            ha='left', va='center')

    # ── BACKEND LAYER ──
    back_outer = FancyBboxPatch((0.3, 2.5), 12.4, 3.2,
                                boxstyle="round,pad=0.05,rounding_size=0.15",
                                facecolor='#E8F5E9', edgecolor=COLORS['secondary'], linewidth=2, zorder=1)
    ax.add_patch(back_outer)
    ax.text(0.7, 5.47, 'BACKEND LAYER  (Spring Boot)', fontsize=9, fontweight='bold',
            color=COLORS['secondary'])

    draw_box(ax, 0.6, 5.05, 11.8, 0.32, 'Spring Security  +  JWT Authentication Filter',
             facecolor='#DCEDC8', edgecolor=COLORS['secondary'], fontsize=9, bold=True)

    controllers = [
        'Auth\nController', 'College\nController', 'Application\nController',
        'Query\nController', 'Feedback\nController', 'Reports\nController', 'File\nController',
    ]
    cw, gap = 1.55, 0.08
    for i, c in enumerate(controllers):
        cx = 0.62 + i * (cw + gap)
        draw_box(ax, cx, 4.42, cw, 0.52, c, facecolor=COLORS['white'],
                 edgecolor=COLORS['secondary'], fontsize=7.5)

    draw_box(ax, 0.6, 3.98, 11.8, 0.32, 'Service Layer  (Business Logic)',
             facecolor='#C8E6C9', edgecolor=COLORS['secondary'], fontsize=9, bold=True)

    draw_box(ax, 0.6, 3.55, 11.8, 0.32, 'Repository Layer  (Spring Data JPA / Hibernate)',
             facecolor='#A5D6A7', edgecolor=COLORS['secondary'], fontsize=9, bold=True)

    # ── ARROW ──
    ax.annotate('', xy=(6.5, 2.35), xytext=(6.5, 2.5),
                arrowprops=dict(arrowstyle='<->', color=COLORS['muted'], lw=2.0))
    ax.text(6.52, 2.43, 'JDBC / JPA', fontsize=8, color=COLORS['muted'], ha='left', va='center')

    # ── DATA LAYER ──
    data_outer = FancyBboxPatch((0.3, 0.25), 12.4, 1.95,
                                boxstyle="round,pad=0.05,rounding_size=0.15",
                                facecolor='#FFF3E0', edgecolor=COLORS['accent'], linewidth=2, zorder=1)
    ax.add_patch(data_outer)
    ax.text(0.7, 2.0, 'DATA LAYER', fontsize=9, fontweight='bold', color=COLORS['accent'])

    draw_box(ax, 0.7, 0.45, 5.5, 1.35, 'MySQL Database\n(Structured Data)',
             facecolor='#FFE0B2', edgecolor=COLORS['accent'], fontsize=10, bold=True)
    draw_box(ax, 7.0, 0.45, 5.5, 1.35, 'File Storage\n(Images / Documents)',
             facecolor='#FFE0B2', edgecolor=COLORS['accent'], fontsize=10, bold=True)

    save(fig, 'arch_01_high_level.png')


# ─────────────────────────────────────────────────────────────────
# 2. N-Tier Layered Architecture
# ─────────────────────────────────────────────────────────────────
def gen_ntier():
    fig, ax = plt.subplots(figsize=(8, 10))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_title('Application Architecture — Layered (N-Tier)', fontsize=14, fontweight='bold',
                 color=COLORS['dark'], pad=12)

    layers = [
        ('Presentation Layer', 'React Components + Pages', '#1565C0', '#BBDEFB', '#1976D2'),
        ('Controller Layer', 'REST Controllers — Spring MVC', '#1B5E20', '#C8E6C9', '#2E7D32'),
        ('Service Layer', 'Business Logic + Validation', '#4A148C', '#E1BEE7', '#6A1B9A'),
        ('Repository Layer', 'Spring Data JPA Repositories', '#E65100', '#FFE0B2', '#EF6C00'),
        ('Entity / Model Layer', 'JPA Entities / Hibernate Mapping', '#006064', '#B2EBF2', '#00838F'),
        ('Database Layer', 'MySQL 8.x', '#B71C1C', '#FFCDD2', '#C62828'),
    ]

    bh = 1.1
    gap = 0.45
    total = len(layers)
    for i, (name, sub, text_c, face_c, edge_c) in enumerate(layers):
        y = 8.6 - i * (bh + gap)
        box = FancyBboxPatch((1.0, y), 6.0, bh,
                             boxstyle="round,pad=0.05,rounding_size=0.12",
                             facecolor=face_c, edgecolor=edge_c, linewidth=2, zorder=3)
        ax.add_patch(box)
        ax.text(4.0, y + bh * 0.62, name, ha='center', va='center',
                fontsize=12, fontweight='bold', color=text_c, zorder=4)
        ax.text(4.0, y + bh * 0.25, sub, ha='center', va='center',
                fontsize=9, color=COLORS['muted'], zorder=4)

        if i < total - 1:
            ay = y - gap / 2
            draw_arrow(ax, 4.0, y, 4.0, ay + 0.05, color=COLORS['muted'])

    save(fig, 'arch_02_ntier.png')


# ─────────────────────────────────────────────────────────────────
# 3. Authentication & Authorization Flow
# ─────────────────────────────────────────────────────────────────
def gen_auth_flow():
    fig, ax = plt.subplots(figsize=(10, 13))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 13)
    ax.axis('off')
    ax.set_title('Authentication & Authorization Flow', fontsize=14, fontweight='bold',
                 color=COLORS['dark'], pad=12)

    nodes = [
        (5.0, 11.8, 'Student / Admin / Counsellor', '', COLORS['primary_light'], COLORS['primary']),
        (5.0, 10.0, 'Auth Controller', 'POST /api/auth/login', COLORS['secondary_light'], COLORS['secondary']),
        (5.0,  8.1, 'Auth Service', 'Validate credentials', '#E1BEE7', COLORS['purple']),
        (5.0,  6.2, 'UserRepository', 'MySQL lookup', '#FFE0B2', COLORS['accent']),
        (5.0,  4.3, 'JWT Provider', 'Generate JWT Token', '#B2DFDB', COLORS['teal']),
        (5.0,  2.4, 'Client', 'Stores JWT Token', COLORS['primary_light'], COLORS['primary']),
        (5.0,  0.5, 'JWT Filter', 'Validates token → sets SecurityContext', COLORS['red_light'], COLORS['red']),
    ]

    bw, bh = 5.2, 0.95
    for (cx, cy, lbl, sub, face, edge) in nodes:
        draw_box(ax, cx - bw / 2, cy - bh / 2, bw, bh, lbl, sub,
                 facecolor=face, edgecolor=edge, fontsize=10, bold=True)

    steps = [
        (11.2, '① POST /api/auth/login (credentials)'),
        (9.25, '② Validate credentials'),
        (7.35, '③ Query DB'),
        (5.45, '④ Generate JWT'),
        (3.55, '⑤ Return JWT to client'),
        (1.65, '⑥ Subsequent requests: Authorization: Bearer <token>'),
    ]
    for i in range(len(nodes) - 1):
        y_from = nodes[i][1] - nodes[i][0] * 0 - 0.48
        y_to   = nodes[i+1][1] + 0.48
        draw_arrow(ax, 5.0, y_from, 5.0, y_to, color=COLORS['muted'])
        step_lbl = steps[i][1]
        ax.text(5.35, (y_from + y_to) / 2, step_lbl, fontsize=7.5,
                color=COLORS['muted'], va='center')

    # RBAC table
    ax.text(5.0, -0.35, 'Role-Based Access: ADMIN  ·  COUNSELLOR  ·  STUDENT',
            ha='center', fontsize=8.5, color=COLORS['muted'])

    save(fig, 'arch_03_auth_flow.png')


# ─────────────────────────────────────────────────────────────────
# 4. File Upload Architecture
# ─────────────────────────────────────────────────────────────────
def gen_file_upload():
    fig, ax = plt.subplots(figsize=(7, 9))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 7)
    ax.set_ylim(0, 9)
    ax.axis('off')
    ax.set_title('File Upload Architecture', fontsize=14, fontweight='bold',
                 color=COLORS['dark'], pad=12)

    nodes = [
        (3.5, 8.0, 'Client (React)', 'Multipart Form Data', COLORS['primary_light'], COLORS['primary']),
        (3.5, 6.4, 'FileController', 'Receives upload request', COLORS['secondary_light'], COLORS['secondary']),
        (3.5, 4.8, 'FileStorageService', 'Saves to local storage', '#E1BEE7', COLORS['purple']),
        (3.5, 3.2, 'Database', 'Stores file path / URL', '#FFE0B2', COLORS['accent']),
        (3.5, 1.6, 'Client (React)', 'GET /api/files/{filename}', COLORS['teal_light'], COLORS['teal']),
        (3.5, 0.1, 'Displayed Image', 'Rendered in browser', COLORS['red_light'], COLORS['red']),
    ]

    bw, bh = 4.2, 0.9
    for (cx, cy, lbl, sub, face, edge) in nodes:
        draw_box(ax, cx - bw / 2, cy - bh / 2, bw, bh, lbl, sub,
                 facecolor=face, edgecolor=edge, fontsize=10, bold=True)

    labels = [
        'Multipart POST /api/files/upload',
        'Save file to disk',
        'Store path in College/Facility record',
        'Serve via static endpoint',
        'Display image',
    ]
    for i in range(len(nodes) - 1):
        y_from = nodes[i][1] - bh / 2
        y_to   = nodes[i+1][1] + bh / 2
        draw_arrow(ax, 3.5, y_from, 3.5, y_to, color=COLORS['muted'])
        ax.text(3.7, (y_from + y_to) / 2, labels[i], fontsize=7.5,
                color=COLORS['muted'], va='center')

    save(fig, 'arch_04_file_upload.png')


# ─────────────────────────────────────────────────────────────────
# 5. Data Flow — Student Applies to College
# ─────────────────────────────────────────────────────────────────
def gen_data_flow():
    fig, ax = plt.subplots(figsize=(9, 10))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 9)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_title('Data Flow: Student Applies to College', fontsize=14, fontweight='bold',
                 color=COLORS['dark'], pad=12)

    steps = [
        ('ApplicationForm.jsx', 'Student fills the form', COLORS['primary_light'], COLORS['primary']),
        ('applicationApi.js', 'submitApplication(data)', '#DCEDC8', COLORS['secondary']),
        ('Axios / HTTP', 'POST /api/applications  +  JWT Header', '#FFE0B2', COLORS['accent']),
        ('JwtAuthenticationFilter', 'Validates token', COLORS['red_light'], COLORS['red']),
        ('ApplicationController', 'Receives & routes request', COLORS['secondary_light'], COLORS['secondary']),
        ('ApplicationService', 'Processes business logic', '#E1BEE7', COLORS['purple']),
        ('ApplicationRepository', 'Saves to MySQL', '#B2DFDB', COLORS['teal']),
        ('Response propagates back', 'Through all layers', COLORS['primary_light'], COLORS['primary']),
        ('Frontend UI', 'Displays success / error toast', COLORS['accent_light'], COLORS['accent']),
    ]

    bw, bh = 5.5, 0.78
    cx = 4.5
    start_y = 9.1
    spacing = 0.98

    for i, (lbl, sub, face, edge) in enumerate(steps):
        y = start_y - i * spacing
        draw_box(ax, cx - bw / 2, y - bh / 2, bw, bh, lbl, sub,
                 facecolor=face, edgecolor=edge, fontsize=9.5, bold=True)
        if i < len(steps) - 1:
            y_from = y - bh / 2
            y_to   = start_y - (i + 1) * spacing + bh / 2
            draw_arrow(ax, cx, y_from, cx, y_to, color=COLORS['muted'])

    save(fig, 'arch_05_data_flow.png')


# ─────────────────────────────────────────────────────────────────
# 6. UI Page Map
# ─────────────────────────────────────────────────────────────────
def gen_page_map():
    fig, ax = plt.subplots(figsize=(16, 11))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 11)
    ax.axis('off')
    ax.set_title('UI Page Map — Online Campus Info System', fontsize=15, fontweight='bold',
                 color=COLORS['dark'], pad=14)

    def box(x, y, w, h, lbl, sub=None, face=COLORS['primary_light'], edge=COLORS['primary'],
            fs=9, bold=False):
        draw_box(ax, x, y, w, h, lbl, sub, facecolor=face, edgecolor=edge,
                 fontsize=fs, bold=bold, radius=0.08)

    def arr(x1, y1, x2, y2):
        draw_arrow(ax, x1, y1, x2, y2, color='#9E9E9E')

    # Root
    box(6.5, 9.55, 3.0, 0.8, 'Home Page', face='#FFF9C4', edge='#F57F17', bold=True, fs=11)

    # Login / Register
    box(2.5, 7.9, 2.5, 0.75, 'Login', face=COLORS['primary_light'], edge=COLORS['primary'])
    box(11.0, 7.9, 2.5, 0.75, 'Register', face=COLORS['primary_light'], edge=COLORS['primary'])

    arr(8.0, 9.55, 3.75, 8.65)
    arr(8.0, 9.55, 12.25, 8.65)

    # Role dashboards
    box(0.3, 5.8, 2.8, 0.8, 'Admin\nDashboard', face='#FCE4EC', edge=COLORS['red'], bold=True)
    box(4.6, 5.8, 2.8, 0.8, 'Student\nDashboard', face=COLORS['secondary_light'],
        edge=COLORS['secondary'], bold=True)
    box(8.9, 5.8, 2.8, 0.8, 'Counsellor\nDashboard', face='#EDE7F6', edge=COLORS['purple'], bold=True)
    box(12.8, 5.8, 2.8, 0.8, 'Public\nBrowse', face='#E0F2F1', edge=COLORS['teal'], bold=True)

    arr(3.75, 7.9, 1.7, 6.6)
    arr(3.75, 7.9, 6.0, 6.6)
    arr(3.75, 7.9, 10.3, 6.6)
    arr(3.75, 7.9, 14.2, 6.6)

    # Admin pages
    admin_pages = ['Manage Colleges', 'Add / Edit College', 'View Applications', 'Admin Reports']
    for i, p in enumerate(admin_pages):
        y = 4.45 - i * 0.88
        box(0.1, y, 2.5, 0.72, p, face='#FFCDD2', edge=COLORS['red'], fs=8)
        arr(1.7, 5.8, 1.35, y + 0.72)

    # Student pages
    student_pages = [
        'Browse Colleges', 'College Detail', 'Apply to College',
        'My Applications', 'Raise Query', 'My Queries', 'Give Feedback', 'View Reports',
    ]
    for i, p in enumerate(student_pages):
        col = i // 4
        row = i % 4
        bx = 4.3 + col * 2.7
        by = 4.45 - row * 0.88
        box(bx, by, 2.5, 0.72, p, face='#DCEDC8', edge=COLORS['secondary'], fs=8)
        arr(6.0, 5.8, bx + 1.25, by + 0.72)

    # Counsellor pages
    coun_pages = ['View Queries', 'Respond to Query']
    for i, p in enumerate(coun_pages):
        y = 4.45 - i * 0.88
        box(8.7, y, 2.5, 0.72, p, face='#EDE7F6', edge=COLORS['purple'], fs=8)
        arr(10.3, 5.8, 9.95, y + 0.72)

    save(fig, 'ui_00_page_map.png')


# ─────────────────────────────────────────────────────────────────
# 7. UI Wireframe — Dashboard cards (Student, Admin, Counsellor)
# ─────────────────────────────────────────────────────────────────
def gen_dashboard_wireframes():
    dashboards = [
        {
            'title': 'Student Dashboard',
            'file': 'ui_04_student_dashboard.png',
            'cards': [
                ('Total\nColleges', '25', COLORS['primary_light'], COLORS['primary']),
                ('My\nApplications', '3', COLORS['secondary_light'], COLORS['secondary']),
                ('Pending\nQueries', '1', '#FFE0B2', COLORS['accent']),
            ],
            'table_cols': ['College', 'Course', 'Status', 'Date'],
            'table_rows': [
                ['ABC College', 'B.Tech', 'Pending', '15 May'],
                ['XYZ Univ', 'MCA', 'Accepted', '10 May'],
            ],
            'table_title': 'Recent Applications',
            'nav': ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'],
        },
        {
            'title': 'Admin Dashboard',
            'file': 'ui_08_admin_dashboard.png',
            'cards': [
                ('Total\nColleges', '5', '#FFCDD2', COLORS['red']),
                ('Total\nApplications', '45', COLORS['secondary_light'], COLORS['secondary']),
                ('Pending\nApplications', '12', '#FFE0B2', COLORS['accent']),
            ],
            'table_cols': ['College Name', 'Courses', 'Applications', 'Actions'],
            'table_rows': [
                ['ABC College', '12', '30', 'Edit  |  Delete'],
                ['XYZ Univ', '8', '15', 'Edit  |  Delete'],
            ],
            'table_title': 'My Colleges',
            'nav': ['Dashboard', 'Manage Colleges', 'View Applications', 'Reports'],
        },
        {
            'title': 'Counsellor Dashboard',
            'file': 'ui_09_counsellor_dashboard.png',
            'cards': [
                ('Open\nQueries', '8', '#FFE0B2', COLORS['accent']),
                ('Resolved\nQueries', '32', COLORS['secondary_light'], COLORS['secondary']),
                ('My\nRating', '4.3/5', '#E1BEE7', COLORS['purple']),
            ],
            'table_cols': ['Student', 'Subject', 'Date', 'Action'],
            'table_rows': [
                ['John', 'Admission Q..', '15 May', 'View'],
                ['Alice', 'Fee Structure', '14 May', 'View'],
                ['Bob', 'Hostel Query', '13 May', 'View'],
            ],
            'table_title': 'Pending Queries',
            'nav': ['Dashboard', 'View Queries'],
        },
    ]

    for d in dashboards:
        fig, ax = plt.subplots(figsize=(13, 8))
        fig.patch.set_facecolor(COLORS['gray_bg'])
        ax.set_facecolor(COLORS['gray_bg'])
        ax.set_xlim(0, 13)
        ax.set_ylim(0, 8)
        ax.axis('off')

        # Topbar
        top = FancyBboxPatch((0, 7.4), 13, 0.6,
                             boxstyle="square,pad=0", facecolor=COLORS['primary'], linewidth=0)
        ax.add_patch(top)
        ax.text(0.3, 7.7, '[Logo]  Online Campus Info', color='white', fontsize=10, va='center')
        ax.text(10.5, 7.7, 'Welcome!    [Logout]', color='white', fontsize=9, va='center')

        # Sidebar
        side = FancyBboxPatch((0, 0), 2.2, 7.4, boxstyle="square,pad=0",
                              facecolor='#1565C0', linewidth=0)
        ax.add_patch(side)
        for i, item in enumerate(d['nav']):
            bg = '#1976D2' if i == 0 else '#1565C0'
            ay = 6.8 - i * 0.7
            if i == 0:
                hl = FancyBboxPatch((0.05, ay - 0.2), 2.1, 0.5,
                                    boxstyle="round,pad=0.02,rounding_size=0.05",
                                    facecolor='#1976D2', linewidth=0)
                ax.add_patch(hl)
            ax.text(1.1, ay + 0.05, item, color='white', fontsize=8, ha='center', va='center')

        # Main content
        ax.text(6.5, 7.0, d['title'], ha='center', fontsize=13, fontweight='bold',
                color=COLORS['dark'])

        # Stat cards
        cw, ch = 2.4, 1.3
        cx_starts = [2.6, 5.4, 8.2]
        for i, (lbl, val, face, edge) in enumerate(d['cards']):
            cx0 = cx_starts[i]
            card = FancyBboxPatch((cx0, 5.35), cw, ch,
                                  boxstyle="round,pad=0.04,rounding_size=0.1",
                                  facecolor=face, edgecolor=edge, linewidth=1.5, zorder=3)
            ax.add_patch(card)
            ax.text(cx0 + cw / 2, 5.35 + ch * 0.70, lbl, ha='center', va='center',
                    fontsize=8.5, color=COLORS['muted'], zorder=4)
            ax.text(cx0 + cw / 2, 5.35 + ch * 0.28, val, ha='center', va='center',
                    fontsize=18, fontweight='bold', color=edge, zorder=4)

        # Table
        ax.text(2.6, 5.1, d['table_title'], fontsize=10, fontweight='bold', color=COLORS['dark'])
        cols = d['table_cols']
        col_w = 8.8 / len(cols)
        # header
        thead = FancyBboxPatch((2.5, 4.55), 8.8, 0.48,
                               boxstyle="square,pad=0", facecolor='#E3F2FD', linewidth=0)
        ax.add_patch(thead)
        for j, c in enumerate(cols):
            ax.text(2.5 + j * col_w + col_w / 2, 4.79, c, ha='center', va='center',
                    fontsize=8.5, fontweight='bold', color=COLORS['primary'])

        for r, row in enumerate(d['table_rows']):
            ry = 4.55 - (r + 1) * 0.52
            rbg = FancyBboxPatch((2.5, ry), 8.8, 0.48,
                                 boxstyle="square,pad=0",
                                 facecolor=COLORS['white'] if r % 2 == 0 else '#F9F9F9',
                                 linewidth=0)
            ax.add_patch(rbg)
            for j, cell in enumerate(row):
                color = COLORS['dark']
                if cell == 'Pending': color = COLORS['accent']
                elif cell == 'Accepted': color = COLORS['secondary']
                elif cell in ('View', 'Edit  |  Delete'): color = COLORS['primary']
                ax.text(2.5 + j * col_w + col_w / 2, ry + 0.24, cell,
                        ha='center', va='center', fontsize=8, color=color)

        # table border
        for j in range(len(cols) + 1):
            lx = 2.5 + j * col_w
            ax.plot([lx, lx], [4.55 - len(d['table_rows']) * 0.52, 5.03], color=COLORS['border'], lw=0.5)
        ax.plot([2.5, 11.3], [5.03, 5.03], color=COLORS['border'], lw=0.5)
        ax.plot([2.5, 11.3], [4.55 - len(d['table_rows']) * 0.52, 4.55 - len(d['table_rows']) * 0.52],
                color=COLORS['border'], lw=0.5)
        ax.plot([2.5, 2.5], [4.55 - len(d['table_rows']) * 0.52, 5.03], color=COLORS['border'], lw=0.5)
        ax.plot([11.3, 11.3], [4.55 - len(d['table_rows']) * 0.52, 5.03], color=COLORS['border'], lw=0.5)

        save(fig, d['file'])


# ─────────────────────────────────────────────────────────────────
# 8. UI Wireframe — Home Page
# ─────────────────────────────────────────────────────────────────
def gen_home_page():
    fig, ax = plt.subplots(figsize=(13, 9))
    fig.patch.set_facecolor(COLORS['gray_bg'])
    ax.set_facecolor(COLORS['gray_bg'])
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')
    ax.set_title('UI Wireframe — Home Page', fontsize=13, fontweight='bold',
                 color=COLORS['dark'], pad=10)

    # Navbar
    nav = FancyBboxPatch((0, 8.3), 13, 0.65, boxstyle="square,pad=0",
                         facecolor=COLORS['primary'], linewidth=0)
    ax.add_patch(nav)
    ax.text(0.4, 8.62, '[Logo]  Online Campus Info System', color='white', fontsize=10, va='center')
    for i, lbl in enumerate(['Login', 'Register']):
        bx = 10.2 + i * 1.6
        btn = FancyBboxPatch((bx, 8.4), 1.3, 0.42,
                             boxstyle="round,pad=0.02,rounding_size=0.06",
                             facecolor='white', edgecolor='white', linewidth=0)
        ax.add_patch(btn)
        ax.text(bx + 0.65, 8.61, lbl, ha='center', va='center',
                fontsize=9, color=COLORS['primary'], fontweight='bold')

    # Hero
    hero = FancyBboxPatch((0, 6.7), 13, 1.55, boxstyle="square,pad=0",
                          facecolor='#E3F2FD', linewidth=0)
    ax.add_patch(hero)
    ax.text(6.5, 7.72, 'Welcome to Online Campus Info System', ha='center', fontsize=13,
            fontweight='bold', color=COLORS['primary'])
    ax.text(6.5, 7.35, 'Find your dream college and start your journey', ha='center',
            fontsize=10, color=COLORS['muted'])
    search_bg = FancyBboxPatch((2.5, 6.8), 7.0, 0.45,
                               boxstyle="round,pad=0.02,rounding_size=0.07",
                               facecolor='white', edgecolor=COLORS['border'], linewidth=1)
    ax.add_patch(search_bg)
    ax.text(2.8, 7.02, 'Search Colleges...', fontsize=9, color='#BDBDBD', va='center')
    sbtn = FancyBboxPatch((9.55, 6.80), 1.0, 0.45,
                          boxstyle="round,pad=0.02,rounding_size=0.07",
                          facecolor=COLORS['primary'], linewidth=0)
    ax.add_patch(sbtn)
    ax.text(10.05, 7.02, 'Search', ha='center', va='center', fontsize=9,
            color='white', fontweight='bold')

    # Featured
    ax.text(0.5, 6.42, 'Featured Colleges', fontsize=11, fontweight='bold', color=COLORS['dark'])
    colleges = [('College A', '4.5'), ('College B', '4.2'), ('College C', '4.0'), ('College D', '3.8')]
    for i, (name, rating) in enumerate(colleges):
        cx0 = 0.3 + i * 3.2
        card = FancyBboxPatch((cx0, 2.2), 2.8, 4.0,
                              boxstyle="round,pad=0.04,rounding_size=0.1",
                              facecolor='white', edgecolor=COLORS['border'], linewidth=1)
        ax.add_patch(card)
        img = FancyBboxPatch((cx0 + 0.1, 4.4), 2.6, 1.65,
                             boxstyle="round,pad=0.02,rounding_size=0.05",
                             facecolor='#E3F2FD', edgecolor=COLORS['border'], linewidth=0.5)
        ax.add_patch(img)
        ax.text(cx0 + 1.4, 5.27, '[Image]', ha='center', va='center', fontsize=9,
                color=COLORS['muted'])
        ax.text(cx0 + 1.4, 4.18, name, ha='center', fontsize=9.5, fontweight='bold',
                color=COLORS['dark'])
        ax.text(cx0 + 1.4, 3.88, 'City, State', ha='center', fontsize=8.5, color=COLORS['muted'])
        ax.text(cx0 + 1.4, 3.58, f'Rating: ★ {rating}', ha='center', fontsize=8.5,
                color=COLORS['accent'])
        vbtn = FancyBboxPatch((cx0 + 0.4, 2.35), 2.0, 0.42,
                              boxstyle="round,pad=0.02,rounding_size=0.07",
                              facecolor=COLORS['primary'], linewidth=0)
        ax.add_patch(vbtn)
        ax.text(cx0 + 1.4, 2.565, 'View More', ha='center', va='center',
                fontsize=8.5, color='white', fontweight='bold')

    # Footer
    footer = FancyBboxPatch((0, 0), 13, 0.6, boxstyle="square,pad=0",
                            facecolor='#ECEFF1', linewidth=0)
    ax.add_patch(footer)
    ax.text(6.5, 0.3, 'About  |  Contact  |  Privacy Policy', ha='center', va='center',
            fontsize=8.5, color=COLORS['muted'])

    save(fig, 'ui_01_home.png')


# ─────────────────────────────────────────────────────────────────
# Run all
# ─────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    gen_high_level()
    gen_ntier()
    gen_auth_flow()
    gen_file_upload()
    gen_data_flow()
    gen_page_map()
    gen_dashboard_wireframes()
    gen_home_page()
    print('\nAll diagrams generated successfully.')
