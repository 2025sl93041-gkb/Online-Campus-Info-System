"""
Generate the missing UI wireframe PNGs for sections 2, 3, 5, 6, 7, 10, 11, 12.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

C = {
    'primary':       '#1976D2',
    'primary_light': '#BBDEFB',
    'primary_dark':  '#1565C0',
    'secondary':     '#388E3C',
    'secondary_light':'#C8E6C9',
    'accent':        '#FF8F00',
    'accent_light':  '#FFF3E0',
    'purple':        '#7B1FA2',
    'purple_light':  '#E1BEE7',
    'teal':          '#00796B',
    'teal_light':    '#B2DFDB',
    'red':           '#D32F2F',
    'red_light':     '#FFCDD2',
    'gray_bg':       '#F5F5F5',
    'gray_mid':      '#ECEFF1',
    'white':         '#FFFFFF',
    'dark':          '#212121',
    'muted':         '#757575',
    'border':        '#BDBDBD',
    'input_bg':      '#FAFAFA',
}


def save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"Saved: {path}")


def topbar(ax, W, H, title_left, title_right='Welcome, John!    [Logout]'):
    bar = FancyBboxPatch((0, H - 0.65), W, 0.65, boxstyle="square,pad=0",
                         facecolor=C['primary_dark'], linewidth=0, zorder=5)
    ax.add_patch(bar)
    ax.text(0.35, H - 0.32, title_left, color='white', fontsize=9.5, va='center', zorder=6)
    ax.text(W - 0.35, H - 0.32, title_right, color='white', fontsize=8.5, va='center',
            ha='right', zorder=6)


def sidebar(ax, H, nav_items, active=0):
    side = FancyBboxPatch((0, 0), 2.3, H - 0.65, boxstyle="square,pad=0",
                          facecolor=C['primary_dark'], linewidth=0, zorder=4)
    ax.add_patch(side)
    for i, item in enumerate(nav_items):
        ay = H - 1.35 - i * 0.72
        if i == active:
            hl = FancyBboxPatch((0.08, ay - 0.22), 2.15, 0.5,
                                boxstyle="round,pad=0.02,rounding_size=0.06",
                                facecolor='#1976D2', linewidth=0, zorder=5)
            ax.add_patch(hl)
        ax.text(1.19, ay + 0.03, item, color='white', fontsize=8, ha='center',
                va='center', zorder=6)


def section_label(ax, x, y, text):
    ax.text(x, y, text, fontsize=10, fontweight='bold', color=C['dark'])


def input_field(ax, x, y, w, h=0.38, label=None, placeholder=''):
    if label:
        ax.text(x, y + h + 0.04, label, fontsize=8.5, color=C['dark'])
    field = FancyBboxPatch((x, y), w, h,
                           boxstyle="round,pad=0.02,rounding_size=0.05",
                           facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(field)
    if placeholder:
        ax.text(x + 0.12, y + h / 2, placeholder, fontsize=8, color='#BDBDBD',
                va='center', zorder=5)


def btn(ax, x, y, w, h, label, facecolor=None, textcolor='white'):
    fc = facecolor or C['primary']
    b = FancyBboxPatch((x, y), w, h,
                       boxstyle="round,pad=0.02,rounding_size=0.07",
                       facecolor=fc, edgecolor='none', linewidth=0, zorder=5)
    ax.add_patch(b)
    ax.text(x + w / 2, y + h / 2, label, ha='center', va='center',
            fontsize=9, color=textcolor, fontweight='bold', zorder=6)


def card_box(ax, x, y, w, h, fc=None, ec=None, radius=0.1, zorder=3):
    b = FancyBboxPatch((x, y), w, h,
                       boxstyle=f"round,pad=0.03,rounding_size={radius}",
                       facecolor=fc or C['white'], edgecolor=ec or C['border'],
                       linewidth=1.5, zorder=zorder)
    ax.add_patch(b)
    return b


def table_header(ax, x, y, cols, col_w, h=0.42, fc='#E3F2FD'):
    bg = FancyBboxPatch((x, y), sum(col_w), h, boxstyle="square,pad=0",
                        facecolor=fc, linewidth=0, zorder=4)
    ax.add_patch(bg)
    cx = x
    for c, w in zip(cols, col_w):
        ax.text(cx + w / 2, y + h / 2, c, ha='center', va='center',
                fontsize=8, fontweight='bold', color=C['primary'], zorder=5)
        cx += w


def table_row(ax, x, y, cells, col_w, h=0.42, idx=0):
    bg = FancyBboxPatch((x, y), sum(col_w), h, boxstyle="square,pad=0",
                        facecolor=C['white'] if idx % 2 == 0 else '#F9F9F9',
                        linewidth=0, zorder=4)
    ax.add_patch(bg)
    cx = x
    for cell, w in zip(cells, col_w):
        color = C['dark']
        if cell in ('Pending', 'PENDING'): color = C['accent']
        elif cell in ('Accepted', 'ACCEPTED'): color = C['secondary']
        elif cell in ('Rejected', 'REJECTED'): color = C['red']
        ax.text(cx + w / 2, y + h / 2, cell, ha='center', va='center',
                fontsize=7.5, color=color, zorder=5)
        cx += w


def table_border(ax, x, y_top, y_bot, col_w):
    total_w = sum(col_w)
    ax.plot([x, x + total_w], [y_top, y_top], color=C['border'], lw=0.7, zorder=6)
    ax.plot([x, x + total_w], [y_bot, y_bot], color=C['border'], lw=0.7, zorder=6)
    ax.plot([x, x], [y_bot, y_top], color=C['border'], lw=0.7, zorder=6)
    ax.plot([x + total_w, x + total_w], [y_bot, y_top], color=C['border'], lw=0.7, zorder=6)
    cx = x
    for w in col_w[:-1]:
        cx += w
        ax.plot([cx, cx], [y_bot, y_top], color=C['border'], lw=0.5, zorder=6)


# ─────────────────────────────────────────────────────────────────
# 2. Login Page
# ─────────────────────────────────────────────────────────────────
def gen_login():
    W, H = 11, 9
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Login Page', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    # Navbar (no sidebar - public page)
    bar = FancyBboxPatch((0, H - 0.65), W, 0.65, boxstyle="square,pad=0",
                         facecolor=C['primary_dark'], linewidth=0, zorder=5)
    ax.add_patch(bar)
    ax.text(0.35, H - 0.32, '[Logo]  Online Campus Info System', color='white',
            fontsize=9.5, va='center', zorder=6)
    btn(ax, W - 1.3, H - 0.56, 1.1, 0.42, '[Home]', facecolor='#1976D2')

    # Card
    cx0, cy0, cw, ch = 3.0, 1.8, 5.0, 6.0
    card_box(ax, cx0, cy0, cw, ch, fc=C['white'], ec=C['border'], radius=0.15, zorder=3)

    # Title bar
    title_bar = FancyBboxPatch((cx0, cy0 + ch - 0.75), cw, 0.75,
                               boxstyle="round,pad=0.02,rounding_size=0.12",
                               facecolor=C['primary'], linewidth=0, zorder=4)
    ax.add_patch(title_bar)
    ax.text(cx0 + cw / 2, cy0 + ch - 0.38, 'LOGIN', ha='center', va='center',
            fontsize=13, fontweight='bold', color='white', zorder=5)

    input_field(ax, cx0 + 0.4, cy0 + 4.0, cw - 0.8, label='Email')
    input_field(ax, cx0 + 0.4, cy0 + 2.9, cw - 0.8, label='Password', placeholder='••••••••••')
    btn(ax, cx0 + 0.4, cy0 + 2.1, cw - 0.8, 0.55, 'LOGIN')

    ax.text(cx0 + cw / 2, cy0 + 1.65, "Don't have an account?", ha='center',
            fontsize=8.5, color=C['muted'])
    ax.text(cx0 + cw / 2, cy0 + 1.3, 'Register here', ha='center',
            fontsize=8.5, color=C['primary'], style='italic')

    save(fig, 'ui_02_login.png')


# ─────────────────────────────────────────────────────────────────
# 3. Registration Page
# ─────────────────────────────────────────────────────────────────
def gen_register():
    W, H = 11, 12
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Registration Page', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    bar = FancyBboxPatch((0, H - 0.65), W, 0.65, boxstyle="square,pad=0",
                         facecolor=C['primary_dark'], linewidth=0, zorder=5)
    ax.add_patch(bar)
    ax.text(0.35, H - 0.32, '[Logo]  Online Campus Info System', color='white',
            fontsize=9.5, va='center', zorder=6)
    btn(ax, W - 1.3, H - 0.56, 1.1, 0.42, '[Home]', facecolor='#1976D2')

    cx0, cy0, cw, ch = 2.5, 0.5, 6.0, 10.5
    card_box(ax, cx0, cy0, cw, ch, fc=C['white'], ec=C['border'], radius=0.15, zorder=3)

    title_bar = FancyBboxPatch((cx0, cy0 + ch - 0.75), cw, 0.75,
                               boxstyle="round,pad=0.02,rounding_size=0.12",
                               facecolor=C['primary'], linewidth=0, zorder=4)
    ax.add_patch(title_bar)
    ax.text(cx0 + cw / 2, cy0 + ch - 0.38, 'REGISTER', ha='center', va='center',
            fontsize=13, fontweight='bold', color='white', zorder=5)

    fields = [
        ('Full Name', 8.7),
        ('Email', 7.6),
        ('Password', 6.5),
        ('Phone', 5.4),
    ]
    for lbl, fy in fields:
        input_field(ax, cx0 + 0.4, cy0 + fy, cw - 0.8, label=lbl)

    # Role radio buttons
    ax.text(cx0 + 0.4, cy0 + 5.0, 'Role:', fontsize=8.5, color=C['dark'])
    roles = [('Student', 4.55), ('Admin', 3.95), ('Counsellor', 3.35)]
    for rlbl, ry in roles:
        circle = plt.Circle((cx0 + 0.62, cy0 + ry), 0.11, color=C['border'],
                            fill=False, linewidth=1.5, zorder=5)
        ax.add_patch(circle)
        ax.text(cx0 + 0.85, cy0 + ry, rlbl, fontsize=8.5, va='center', color=C['dark'])

    btn(ax, cx0 + 0.4, cy0 + 2.4, cw - 0.8, 0.55, 'REGISTER')
    ax.text(cx0 + cw / 2, cy0 + 1.9, 'Already have an account?', ha='center',
            fontsize=8.5, color=C['muted'])
    ax.text(cx0 + cw / 2, cy0 + 1.5, 'Login here', ha='center',
            fontsize=8.5, color=C['primary'], style='italic')

    save(fig, 'ui_03_register.png')


# ─────────────────────────────────────────────────────────────────
# 5. Browse Colleges Page
# ─────────────────────────────────────────────────────────────────
def gen_browse_colleges():
    W, H = 14, 11
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Browse Colleges (Student)', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    topbar(ax, W, H, '[Logo]  Online Campus Info')
    sidebar(ax, H, ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'], active=1)

    section_label(ax, 2.55, H - 1.1, 'BROWSE COLLEGES')

    # Search bar row
    search_bg = FancyBboxPatch((2.5, H - 1.85), 6.5, 0.45,
                               boxstyle="round,pad=0.02,rounding_size=0.07",
                               facecolor=C['white'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(search_bg)
    ax.text(2.75, H - 1.62, 'Search colleges...', fontsize=9, color='#BDBDBD', va='center', zorder=5)
    btn(ax, 9.1, H - 1.85, 1.3, 0.45, 'City ▾', facecolor=C['white'], textcolor=C['dark'])
    btn(ax, 10.55, H - 1.85, 1.5, 0.45, 'Course ▾', facecolor=C['white'], textcolor=C['dark'])
    btn(ax, 12.2, H - 1.85, 1.5, 0.45, 'Search', facecolor=C['primary'])

    # College cards
    colleges = [
        ('ABC Engineering College', 'Bangalore, Karnataka', '1995', '5000', '12', '4.5'),
        ('XYZ University', 'Chennai, Tamil Nadu', '2001', '3000', '8', '4.0'),
        ('PQR Institute of Tech', 'Pune, Maharashtra', '1998', '4200', '15', '4.3'),
    ]
    for i, (name, loc, est, strength, courses, rating) in enumerate(colleges):
        cy = H - 2.7 - i * 2.35
        card = FancyBboxPatch((2.5, cy - 1.9), W - 2.9, 1.95,
                              boxstyle="round,pad=0.04,rounding_size=0.1",
                              facecolor=C['white'], edgecolor=C['border'], linewidth=1, zorder=3)
        ax.add_patch(card)

        # Image placeholder
        img = FancyBboxPatch((2.65, cy - 1.8), 2.2, 1.7,
                             boxstyle="round,pad=0.02,rounding_size=0.06",
                             facecolor=C['primary_light'], edgecolor=C['border'], linewidth=0.5, zorder=4)
        ax.add_patch(img)
        ax.text(3.75, cy - 0.95, '[Image]', ha='center', va='center',
                fontsize=8.5, color=C['muted'], zorder=5)

        # Info
        ax.text(5.15, cy - 0.25, name, fontsize=10, fontweight='bold', color=C['dark'], zorder=5)
        ax.text(5.15, cy - 0.6, f'Location: {loc}', fontsize=8.5, color=C['muted'], zorder=5)
        ax.text(5.15, cy - 0.92, f'Established: {est}  |  Strength: {strength}', fontsize=8.5,
                color=C['muted'], zorder=5)
        ax.text(5.15, cy - 1.24, f'Courses: {courses}  |  Rating: ★ {rating}', fontsize=8.5,
                color=C['accent'], zorder=5)

        btn(ax, 5.15, cy - 1.78, 2.2, 0.38, 'View Details', facecolor=C['primary_light'],
            textcolor=C['primary'])
        btn(ax, 7.55, cy - 1.78, 2.2, 0.38, 'Apply Now', facecolor=C['secondary'])

    # Pagination
    ax.text(W / 2, 0.4, '< Prev     Page 1 of 3     Next >', ha='center',
            fontsize=9, color=C['primary'])

    save(fig, 'ui_05_browse_colleges.png')


# ─────────────────────────────────────────────────────────────────
# 6. College Detail Page
# ─────────────────────────────────────────────────────────────────
def gen_college_detail():
    W, H = 14, 16
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — College Detail Page', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    topbar(ax, W, H, '[Logo]  Online Campus Info')
    sidebar(ax, H, ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'], active=1)

    mx = 2.55  # main content x start
    mw = W - mx - 0.3

    # College header
    ax.text(mx, H - 1.1, 'ABC ENGINEERING COLLEGE', fontsize=13, fontweight='bold',
            color=C['primary'])
    ax.text(mx, H - 1.55, 'Location: Bangalore  |  Established: 1995  |  Rating: ★ 4.5',
            fontsize=8.5, color=C['muted'])

    # Image gallery
    for i in range(4):
        img = FancyBboxPatch((mx + i * 2.75, H - 3.45), 2.5, 1.65,
                             boxstyle="round,pad=0.02,rounding_size=0.07",
                             facecolor=C['primary_light'], edgecolor=C['border'],
                             linewidth=0.5, zorder=3)
        ax.add_patch(img)
        ax.text(mx + i * 2.75 + 1.25, H - 2.62, f'[img{i+1}]', ha='center', va='center',
                fontsize=8, color=C['muted'], zorder=4)

    # About
    ax.text(mx, H - 3.75, 'ABOUT', fontsize=9.5, fontweight='bold', color=C['dark'])
    about_bg = FancyBboxPatch((mx, H - 4.65), mw, 0.78,
                              boxstyle="round,pad=0.03,rounding_size=0.07",
                              facecolor=C['white'], edgecolor=C['border'], linewidth=1, zorder=3)
    ax.add_patch(about_bg)
    ax.text(mx + 0.15, H - 4.27, 'Premier engineering institution offering quality education since 1995...',
            fontsize=8.5, color=C['muted'], va='center', zorder=4)

    # Courses table
    ax.text(mx, H - 4.95, 'COURSES AVAILABLE', fontsize=9.5, fontweight='bold', color=C['dark'])
    cols = ['Course', 'Duration', 'Seats', 'Fee (₹)']
    col_w = [2.8, 2.2, 1.8, 2.2]
    ty = H - 5.95
    table_header(ax, mx, ty, cols, col_w)
    rows = [
        ['B.Tech CS', '4 years', '120', '80,000'],
        ['B.Tech EC', '4 years', '60', '75,000'],
        ['MCA', '2 years', '60', '60,000'],
    ]
    for ri, row in enumerate(rows):
        table_row(ax, mx, ty - (ri + 1) * 0.42, row, col_w, idx=ri)
    table_border(ax, mx, ty + 0.42, ty - len(rows) * 0.42, col_w)

    # Facilities
    fy = H - 8.2
    ax.text(mx, fy + 0.15, 'FACILITIES', fontsize=9.5, fontweight='bold', color=C['dark'])
    facilities = [('Lab', '5 labs'), ('Library', '50K books'), ('Sports', 'Ground'), ('Hostel', '500 cap')]
    for i, (name, detail) in enumerate(facilities):
        fcard = FancyBboxPatch((mx + i * 2.75, fy - 1.35), 2.5, 1.25,
                               boxstyle="round,pad=0.04,rounding_size=0.1",
                               facecolor=C['teal_light'], edgecolor=C['teal'], linewidth=1.2, zorder=3)
        ax.add_patch(fcard)
        ax.text(mx + i * 2.75 + 1.25, fy - 0.6, name, ha='center', va='center',
                fontsize=9.5, fontweight='bold', color=C['teal'], zorder=4)
        ax.text(mx + i * 2.75 + 1.25, fy - 1.0, detail, ha='center', va='center',
                fontsize=8, color=C['muted'], zorder=4)

    # Eligibility
    ey = H - 9.85
    ax.text(mx, ey, 'ELIGIBILITY CRITERIA', fontsize=9.5, fontweight='bold', color=C['dark'])
    elig = ['Minimum 60% in 12th standard', 'Valid entrance exam score required']
    for i, e in enumerate(elig):
        ax.text(mx + 0.2, ey - 0.45 - i * 0.38, f'• {e}', fontsize=8.5, color=C['muted'])

    # Action buttons
    btn(ax, mx, H - 11.6, 3.5, 0.5, 'Apply to this College', facecolor=C['primary'])
    btn(ax, mx + 3.8, H - 11.6, 3.5, 0.5, 'Give Feedback', facecolor=C['secondary'])

    # Feedback section
    ax.text(mx, H - 12.4, 'STUDENT FEEDBACK (25 reviews)', fontsize=9.5,
            fontweight='bold', color=C['dark'])
    fb_rows = [
        ('Student A', '★★★★☆', '"Great campus environment and labs!"'),
        ('Student B', '★★★★★', '"Excellent faculty and placements."'),
        ('Student C', '★★★★☆', '"Good infrastructure, well managed."'),
    ]
    for ri, (stu, stars, comment) in enumerate(fb_rows):
        ry = H - 13.1 - ri * 0.82
        fb_card = FancyBboxPatch((mx, ry - 0.55), mw, 0.68,
                                 boxstyle="round,pad=0.03,rounding_size=0.07",
                                 facecolor=C['white'], edgecolor=C['border'], linewidth=0.8, zorder=3)
        ax.add_patch(fb_card)
        ax.text(mx + 0.2, ry - 0.22, stu, fontsize=8.5, fontweight='bold', color=C['dark'], zorder=4)
        ax.text(mx + 2.2, ry - 0.22, stars, fontsize=8.5, color=C['accent'], zorder=4)
        ax.text(mx + 4.0, ry - 0.22, comment, fontsize=8.5, color=C['muted'], zorder=4)

    save(fig, 'ui_06_college_detail.png')


# ─────────────────────────────────────────────────────────────────
# 7. Application Form Page
# ─────────────────────────────────────────────────────────────────
def gen_application_form():
    W, H = 14, 14
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Application Form Page', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    topbar(ax, W, H, '[Logo]  Online Campus Info')
    sidebar(ax, H, ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'], active=2)

    mx = 2.55
    mw = W - mx - 0.3

    ax.text(mx, H - 1.1, 'APPLY TO: ABC Engineering College', fontsize=11,
            fontweight='bold', color=C['primary'])

    # Form card
    card_box(ax, mx, 0.4, mw, H - 1.9, fc=C['white'], ec=C['border'], radius=0.12, zorder=3)

    # Form title bar
    form_tb = FancyBboxPatch((mx, H - 2.3), mw, 0.48,
                             boxstyle="round,pad=0.02,rounding_size=0.08",
                             facecolor=C['primary_light'], edgecolor=C['primary'], linewidth=1, zorder=4)
    ax.add_patch(form_tb)
    ax.text(mx + mw / 2, H - 2.06, 'ADMISSION APPLICATION FORM', ha='center', va='center',
            fontsize=10, fontweight='bold', color=C['primary'], zorder=5)

    # Dropdown
    ax.text(mx + 0.4, H - 2.8, 'Select Course:', fontsize=8.5, color=C['dark'])
    dd = FancyBboxPatch((mx + 0.4, H - 3.35), mw - 0.8, 0.4,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(dd)
    ax.text(mx + 0.6, H - 3.15, 'B.Tech CS / B.Tech EC / MCA  ▾', fontsize=8.5,
            color=C['muted'], va='center', zorder=5)

    # Two-column fields
    field_pairs = [
        [('Full Name', H - 4.1), ('Email', H - 4.1)],
        [('Phone', H - 5.15), ('Qualification', H - 5.15)],
    ]
    half_w = (mw - 1.2) / 2
    for pair in field_pairs:
        for j, (lbl, fy) in enumerate(pair):
            fx = mx + 0.4 + j * (half_w + 0.4)
            input_field(ax, fx, fy - 0.42, half_w, label=lbl)

    # Percentage
    input_field(ax, mx + 0.4, H - 6.2 - 0.42, 3.0, label='Percentage (%)')

    # Address (textarea)
    ax.text(mx + 0.4, H - 7.0, 'Address:', fontsize=8.5, color=C['dark'])
    addr = FancyBboxPatch((mx + 0.4, H - 8.05), mw - 0.8, 0.9,
                          boxstyle="round,pad=0.02,rounding_size=0.06",
                          facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(addr)

    # Statement of Purpose
    ax.text(mx + 0.4, H - 8.35, 'Statement of Purpose:', fontsize=8.5, color=C['dark'])
    sop = FancyBboxPatch((mx + 0.4, H - 9.8), mw - 0.8, 1.3,
                         boxstyle="round,pad=0.02,rounding_size=0.06",
                         facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(sop)

    btn(ax, mx + mw / 2 - 2.5, 0.8, 5.0, 0.6, 'SUBMIT APPLICATION', facecolor=C['primary'])

    save(fig, 'ui_07_application_form.png')


# ─────────────────────────────────────────────────────────────────
# 10. Reports Page
# ─────────────────────────────────────────────────────────────────
def gen_reports():
    W, H = 14, 13
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Reports & Comparison Page', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    topbar(ax, W, H, '[Logo]  Online Campus Info')
    sidebar(ax, H, ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'], active=6)

    mx = 2.55
    mw = W - mx - 0.3

    section_label(ax, mx, H - 1.1, 'REPORTS & COMPARISON')

    # Bar chart card
    ax.text(mx, H - 1.65, 'College Feedback Comparison', fontsize=10,
            fontweight='bold', color=C['dark'])
    chart_card = FancyBboxPatch((mx, H - 6.5), mw, 4.65,
                                boxstyle="round,pad=0.04,rounding_size=0.1",
                                facecolor=C['white'], edgecolor=C['border'], linewidth=1.2, zorder=3)
    ax.add_patch(chart_card)

    colleges_data = [
        ('ABC College', 4.5, C['primary']),
        ('XYZ Univ', 4.0, C['secondary']),
        ('PQR Institute', 3.5, C['accent']),
        ('LMN College', 3.2, C['purple']),
    ]
    bar_h = 0.55
    bar_max_w = mw - 3.5
    for i, (name, rating, color) in enumerate(colleges_data):
        by = H - 2.8 - i * 0.92
        ax.text(mx + 0.3, by, name, fontsize=8.5, va='center', color=C['dark'], ha='left')
        bar_w = (rating / 5.0) * bar_max_w
        bar_rect = FancyBboxPatch((mx + 2.5, by - bar_h / 2), bar_w, bar_h,
                                  boxstyle="round,pad=0.01,rounding_size=0.04",
                                  facecolor=color, linewidth=0, zorder=4)
        ax.add_patch(bar_rect)
        ax.text(mx + 2.5 + bar_w + 0.15, by, f'★ {rating}', fontsize=8.5,
                va='center', color=color, fontweight='bold', zorder=5)

    # Counsellor performance table
    ax.text(mx, H - 7.0, 'Counsellor Performance', fontsize=10,
            fontweight='bold', color=C['dark'])
    cols = ['Counsellor', 'Total Queries', 'Avg Rating', 'Resolved']
    col_w = [3.0, 2.5, 2.5, 2.0]
    ty = H - 7.95
    table_header(ax, mx, ty, cols, col_w)
    perf_rows = [
        ['Counsellor 1', '32', '4.3', '30'],
        ['Counsellor 2', '28', '4.1', '25'],
        ['Counsellor 3', '41', '4.5', '38'],
    ]
    for ri, row in enumerate(perf_rows):
        table_row(ax, mx, ty - (ri + 1) * 0.42, row, col_w, idx=ri)
    table_border(ax, mx, ty + 0.42, ty - len(perf_rows) * 0.42, col_w)

    btn(ax, mx, 0.5, 4.5, 0.55, 'Download Report as PDF', facecolor=C['red'])

    save(fig, 'ui_10_reports.png')


# ─────────────────────────────────────────────────────────────────
# 11. Raise Query Page
# ─────────────────────────────────────────────────────────────────
def gen_raise_query():
    W, H = 14, 11
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Raise a Query (Student)', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    topbar(ax, W, H, '[Logo]  Online Campus Info')
    sidebar(ax, H, ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'], active=3)

    mx = 2.55
    mw = W - mx - 0.3

    section_label(ax, mx, H - 1.1, 'RAISE A QUERY')

    card_box(ax, mx, 0.6, mw, H - 1.9, fc=C['white'], ec=C['border'], radius=0.12, zorder=3)

    # College dropdown
    ax.text(mx + 0.4, H - 2.1, 'Related College (optional):', fontsize=8.5, color=C['dark'])
    dd = FancyBboxPatch((mx + 0.4, H - 2.65), mw - 0.8, 0.42,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(dd)
    ax.text(mx + 0.6, H - 2.44, 'Select College  ▾', fontsize=8.5, color='#BDBDBD',
            va='center', zorder=5)

    input_field(ax, mx + 0.4, H - 3.6, mw - 0.8, label='Subject')

    # Query textarea
    ax.text(mx + 0.4, H - 4.4, 'Your Query:', fontsize=8.5, color=C['dark'])
    ta = FancyBboxPatch((mx + 0.4, H - 7.0), mw - 0.8, 2.45,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(ta)
    ax.text(mx + 0.6, H - 5.7, 'Describe your query in detail...', fontsize=8.5,
            color='#BDBDBD', va='center', zorder=5)

    btn(ax, mx + mw / 2 - 2.5, 0.95, 5.0, 0.6, 'SUBMIT QUERY', facecolor=C['primary'])

    save(fig, 'ui_11_raise_query.png')


# ─────────────────────────────────────────────────────────────────
# 12. Feedback Form Page
# ─────────────────────────────────────────────────────────────────
def gen_feedback_form():
    W, H = 14, 12
    fig, ax = plt.subplots(figsize=(W, H))
    fig.patch.set_facecolor(C['gray_bg'])
    ax.set_facecolor(C['gray_bg'])
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.set_title('UI Wireframe — Give Feedback (Student)', fontsize=13, fontweight='bold',
                 color=C['dark'], pad=10)

    topbar(ax, W, H, '[Logo]  Online Campus Info')
    sidebar(ax, H, ['Dashboard', 'Browse Colleges', 'My Applications', 'Raise Query',
                    'My Queries', 'Feedback', 'Reports'], active=5)

    mx = 2.55
    mw = W - mx - 0.3

    section_label(ax, mx, H - 1.1, 'GIVE FEEDBACK')

    card_box(ax, mx, 0.6, mw, H - 1.9, fc=C['white'], ec=C['border'], radius=0.12, zorder=3)

    # Feedback type radio
    ax.text(mx + 0.4, H - 2.1, 'Feedback Type:', fontsize=8.5, color=C['dark'])
    types = [('College Feedback', H - 2.65), ('Counsellor Feedback', H - 3.15)]
    for t, ty in types:
        circle = plt.Circle((mx + 0.62, ty), 0.12, color=C['border'],
                            fill=False, linewidth=1.5, zorder=5)
        ax.add_patch(circle)
        ax.text(mx + 0.88, ty, t, fontsize=8.5, va='center', color=C['dark'])

    # Dropdown
    ax.text(mx + 0.4, H - 3.6, 'Select College / Counsellor:', fontsize=8.5, color=C['dark'])
    dd = FancyBboxPatch((mx + 0.4, H - 4.15), mw - 0.8, 0.42,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(dd)
    ax.text(mx + 0.6, H - 3.94, 'Select...  ▾', fontsize=8.5, color='#BDBDBD',
            va='center', zorder=5)

    # Star rating
    ax.text(mx + 0.4, H - 4.9, 'Rating:', fontsize=8.5, color=C['dark'])
    for s in range(5):
        ax.text(mx + 0.4 + s * 0.6, H - 5.45, '★', fontsize=22,
                color=C['accent'], va='center', zorder=5)

    # Comments textarea
    ax.text(mx + 0.4, H - 6.2, 'Comments:', fontsize=8.5, color=C['dark'])
    ta = FancyBboxPatch((mx + 0.4, H - 8.6), mw - 0.8, 2.25,
                        boxstyle="round,pad=0.02,rounding_size=0.06",
                        facecolor=C['input_bg'], edgecolor=C['border'], linewidth=1, zorder=4)
    ax.add_patch(ta)
    ax.text(mx + 0.6, H - 7.45, 'Share your experience...', fontsize=8.5,
            color='#BDBDBD', va='center', zorder=5)

    btn(ax, mx + mw / 2 - 2.5, 0.95, 5.0, 0.6, 'SUBMIT FEEDBACK', facecolor=C['secondary'])

    save(fig, 'ui_12_feedback_form.png')


# ─────────────────────────────────────────────────────────────────
# Run all
# ─────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    gen_login()
    gen_register()
    gen_browse_colleges()
    gen_college_detail()
    gen_application_form()
    gen_reports()
    gen_raise_query()
    gen_feedback_form()
    print('\nAll missing wireframes generated.')
