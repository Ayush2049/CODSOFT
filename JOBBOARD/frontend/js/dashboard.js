import { AuthService } from './auth.js';
import { getAuthToken, getUserType, redirectTo } from '../../frontend/js//util.js';
import { apiRequest } from './api.js';

// DOM Elements
const contentDiv = document.getElementById('content');
const logoutBtn = document.getElementById('logoutBtn');

// Helper functions - moved to the top
function showJobPostingModal() {
  const modalHTML = `
    <div class="modal" id="jobPostingModal">
      <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h3>Post New Job</h3>
        <form id="jobPostForm">
          <div class="form-group">
            <label for="jobTitle">Job Title</label>
            <input type="text" id="jobTitle" required>
          </div>
          <div class="form-group">
            <label for="jobDescription">Description</label>
            <textarea id="jobDescription" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="jobRequirements">Requirements (comma separated)</label>
            <textarea id="jobRequirements" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="jobLocation">Location</label>
            <input type="text" id="jobLocation" required>
          </div>
          <div class="form-group">
            <label for="jobSalary">Salary</label>
            <input type="text" id="jobSalary">
          </div>
          <div class="form-group">
            <label for="jobType">Job Type</label>
            <select id="jobType" required>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <button type="submit" class="primary-btn">Post Job</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('jobPostingModal');
  const closeBtn = modal.querySelector('.close-btn');

  closeBtn.onclick = () => modal.remove();
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  };

  document.getElementById('jobPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const jobData = {
      title: document.getElementById('jobTitle').value,
      description: document.getElementById('jobDescription').value,
      requirements: document.getElementById('jobRequirements').value
        .split(',')
        .map(req => req.trim())
        .filter(req => req !== ''),
      location: document.getElementById('jobLocation').value,
      salary: document.getElementById('jobSalary').value,
      type: document.getElementById('jobType').value
    };

    try {
      await apiRequest('/company/jobs', 'POST', jobData);
      alert('Job posted successfully!');
      modal.remove();
      await loadCompanyDashboard(); // Refresh the dashboard
    } catch (error) {
      alert(`Error posting job: ${error.message}`);
    }
  });
}

async function viewApplicants(jobId) {
  try {
    const response = await apiRequest(`/company/jobs/${jobId}/applicants`);

    const applicantsHTML = response.applicants.map(applicant => `
      <div class="applicant-card">
        <h4>${applicant.userDetails.name}</h4>
        <p>Email: ${applicant.userDetails.email}</p>
        ${applicant.userDetails.skills?.length ? `<p>Skills: ${applicant.userDetails.skills.join(', ')}</p>` : ''}
        <p>Status: 
          <select class="status-select" data-user="${applicant.userId}">
            <option value="applied" ${applicant.status === 'applied' ? 'selected' : ''}>Applied</option>
            <option value="reviewed" ${applicant.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
            <option value="selected" ${applicant.status === 'selected' ? 'selected' : ''}>Selected</option>
            <option value="rejected" ${applicant.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </p>
        <p>Applied on: ${new Date(applicant.appliedDate).toLocaleDateString()}</p>
      </div>
    `).join('');

    const modalHTML = `
      <div class="modal" id="applicantsModal">
        <div class="modal-content wide-modal">
          <span class="close-btn">&times;</span>
          <h3>Applicants for: ${response.jobTitle}</h3>
          <div class="applicants-container">
            ${applicantsHTML}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('applicantsModal');
    const closeBtn = modal.querySelector('.close-btn');

    closeBtn.onclick = () => modal.remove();
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    };

    // Add event listeners for status changes
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const userId = e.target.dataset.user;
        const newStatus = e.target.value;

        try {
          await apiRequest('/company/applicants/status', 'PUT', {
            jobId,
            userId,
            status: newStatus
          });
          alert('Status updated successfully');
        } catch (error) {
          alert(`Error updating status: ${error.message}`);
          e.target.value = e.target.dataset.previousValue;
        }
      });
    });
  } catch (error) {
    alert(`Error loading applicants: ${error.message}`);
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  if (!getAuthToken()) {
    redirectTo('../views/login.html');
    return;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AuthService.logout();
    });
  }

  try {
    const userType = getUserType();

    if (userType === 'user') {
      await loadUserDashboard();
    } else if (userType === 'company') {
      await loadCompanyDashboard();
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    contentDiv.innerHTML = `
            <div class="error-message">
                Error loading dashboard. Please try again.
                <button onclick="window.location.reload()">Reload</button>
            </div>
        `;
  }
});

async function loadUserDashboard() {
  try {
    const [user, jobs] = await Promise.all([
      AuthService.getCurrentUser(),
      apiRequest('/user/jobs')
    ]);

    contentDiv.innerHTML = `
            <section class="user-profile">
                <h2>Welcome, ${user.name}</h2>
                <div class="profile-details">
                    <p><strong>Email:</strong> ${user.email}</p>
                    ${user.skills?.length ? `<p><strong>Skills:</strong> ${user.skills.join(', ')}</p>` : ''}
                    ${user.experience ? `<p><strong>Experience:</strong> ${user.experience}</p>` : ''}
                </div>
            </section>
            
            <section class="applications">
                <h3>Your Applications</h3>
                <div id="applicationsList" class="card-container">
                    ${user.applications?.length ?
        user.applications.map(app => `
                            <div class="card">
                                <h4>${app.jobId.title || 'Application'}</h4>
                                <p>Status: <span class="status-${app.status}">${app.status}</span></p>
                            </div>
                        `).join('') :
        '<p>No applications yet</p>'}
                </div>
            </section>
            
            <section class="available-jobs">
                <h3>Available Jobs</h3>
                <div id="jobsList" class="card-container">
                    ${jobs.map(job => `
                        <div class="card job-card">
                            <h4>${job.title}</h4>
                            <p>${job.companyName}</p>
                            <p>${job.location}</p>
                            <button class="apply-btn" data-job="${job.jobId}">Apply</button>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;

    // Add event listeners for apply buttons
    document.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const jobId = e.target.dataset.job;
        try {
          await apiRequest('/user/apply', 'POST', {
            jobId,
            companyId: jobs.find(j => j.jobId === jobId).companyId
          });
          alert('Application submitted successfully!');
          window.location.reload();
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      });
    });

    // Add job search functionality
    const searchHTML = `
  <div class="job-search">
    <input type="text" id="jobSearchInput" placeholder="Search jobs by title, company or location...">
    <button id="searchBtn"><i class="fas fa-search"></i></button>
  </div>
`;

    document.querySelector('.available-jobs').insertAdjacentHTML('afterbegin', searchHTML);

    // Add filter functionality
    const filterHTML = `
  <div class="job-filters">
    <select id="jobTypeFilter">
      <option value="">All Types</option>
      <option value="full-time">Full-time</option>
      <option value="part-time">Part-time</option>
      <option value="contract">Contract</option>
      <option value="internship">Internship</option>
    </select>
    <select id="locationFilter">
      <option value="">All Locations</option>
      ${[...new Set(jobs.map(job => job.location))].map(loc =>
      `<option value="${loc}">${loc}</option>`
    ).join('')}
    </select>
    <button id="resetFilters">Reset Filters</button>
  </div>
`;

    document.querySelector('.available-jobs').insertAdjacentHTML('afterbegin', filterHTML);

    // Add job statistics
    const statsHTML = `
  <div class="user-stats">
    <div class="stat-card">
      <h4>Applications Sent</h4>
      <p>${user.applications?.length || 0}</p>
    </div>
    <div class="stat-card">
      <h4>Active Applications</h4>
      <p>${user.applications?.filter(app => ['applied', 'reviewed'].includes(app.status)).length || 0}</p>
    </div>
    <div class="stat-card">
      <h4>Profile Strength</h4>
      <div class="progress-bar">
        <div class="progress" style="width: ${calculateProfileStrength(user)}%"></div>
      </div>
      <p>${calculateProfileStrength(user)}%</p>
    </div>
  </div>
`;

    document.querySelector('.user-profile').insertAdjacentHTML('beforeend', statsHTML);

    // Helper function to calculate profile strength
    function calculateProfileStrength(user) {
      let strength = 30; // Base score
      if (user.skills?.length) strength += Math.min(30, user.skills.length * 5);
      if (user.experience) strength += 20;
      if (user.applications?.length) strength += 20;
      return Math.min(100, strength);
    }

    // Add event listeners for search and filter
    document.getElementById('searchBtn').addEventListener('click', filterJobs);
    document.getElementById('jobSearchInput').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') filterJobs();
    });
    document.getElementById('jobTypeFilter').addEventListener('change', filterJobs);
    document.getElementById('locationFilter').addEventListener('change', filterJobs);
    document.getElementById('resetFilters').addEventListener('click', () => {
      document.getElementById('jobSearchInput').value = '';
      document.getElementById('jobTypeFilter').value = '';
      document.getElementById('locationFilter').value = '';
      filterJobs();
    });

    function filterJobs() {
      const searchTerm = document.getElementById('jobSearchInput').value.toLowerCase();
      const typeFilter = document.getElementById('jobTypeFilter').value;
      const locationFilter = document.getElementById('locationFilter').value;

      document.querySelectorAll('.job-card').forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const company = card.querySelector('p:nth-of-type(1)').textContent.toLowerCase();
        const location = card.querySelector('p:nth-of-type(2)').textContent.toLowerCase();
        const jobType = card.dataset.type || '';

        const matchesSearch = title.includes(searchTerm) ||
          company.includes(searchTerm) ||
          location.includes(searchTerm);
        const matchesType = !typeFilter || jobType === typeFilter;
        const matchesLocation = !locationFilter || location.includes(locationFilter.toLowerCase());

        card.style.display = matchesSearch && matchesType && matchesLocation ? 'block' : 'none';
      });
    }

    // Add job bookmarking functionality
    document.querySelectorAll('.job-card').forEach(card => {
      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.className = 'bookmark-btn';
      bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
      bookmarkBtn.onclick = (e) => {
        e.stopPropagation();
        bookmarkBtn.innerHTML = bookmarkBtn.classList.toggle('active') ?
          '<i class="fas fa-bookmark"></i>' : '<i class="far fa-bookmark"></i>';
        // Store in localStorage
        const jobId = card.querySelector('.apply-btn').dataset.job;
        const bookmarks = JSON.parse(localStorage.getItem('jobBookmarks') || '[]');
        const index = bookmarks.indexOf(jobId);

        if (index === -1) {
          bookmarks.push(jobId);
        } else {
          bookmarks.splice(index, 1);
        }

        localStorage.setItem('jobBookmarks', JSON.stringify(bookmarks));
      };

      // Check if already bookmarked
      const jobId = card.querySelector('.apply-btn').dataset.job;
      const bookmarks = JSON.parse(localStorage.getItem('jobBookmarks') || '[]');
      if (bookmarks.includes(jobId)) {
        bookmarkBtn.classList.add('active');
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
      }

      card.insertBefore(bookmarkBtn, card.querySelector('.apply-btn'));
    });



  } catch (error) {
    throw error;
  }
}

async function loadCompanyDashboard() {
  try {
    const [company, jobs] = await Promise.all([
      AuthService.getCurrentUser(),
      apiRequest('/company/jobs')
    ]);

    contentDiv.innerHTML = `
            <section class="company-profile">
                <h2>Welcome, ${company.name}</h2>
                <div class="profile-details">
                    <p><strong>Email:</strong> ${company.email}</p>
                    ${company.description ? `<p><strong>About:</strong> ${company.description}</p>` : ''}
                    ${company.location ? `<p><strong>Location:</strong> ${company.location}</p>` : ''}
                </div>
            </section>
            
            <section class="job-management">
                <div class="section-header">
                    <h3>Your Job Postings</h3>
                    <button id="postJobBtn" class="primary-btn">+ Post New Job</button>
                </div>
                <div id="jobsList" class="card-container">
                    ${jobs.map(job => `
                        <div class="card job-card">
                            <h4>${job.title}</h4>
                            <p>${job.applicants.length} applicants</p>
                            <button class="view-applicants" data-job="${job._id}">
                                View Applicants
                            </button>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;

    // Add event listeners
    document.getElementById('postJobBtn')?.addEventListener('click', () => {
      showJobPostingModal();
    });

    document.querySelectorAll('.view-applicants').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const jobId = e.target.dataset.job;
        viewApplicants(jobId);
      });
    });

    // Add job statistics
    const statsHTML = `
  <div class="company-stats">
    <div class="stat-card">
      <h4>Total Jobs Posted</h4>
      <p>${jobs.length}</p>
    </div>
    <div class="stat-card">
      <h4>Total Applicants</h4>
      <p>${jobs.reduce((sum, job) => sum + job.applicants.length, 0)}</p>
    </div>
    <div class="stat-card">
      <h4>Active Listings</h4>
      <p>${jobs.filter(job => new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</p>
    </div>
  </div>
`;

    document.querySelector('.company-profile').insertAdjacentHTML('beforeend', statsHTML);

    // Add applicant statistics chart
    // Add applicant statistics chart
    const chartHTML = `
  <div class="applicant-chart">
    <h3>Applicant Status Distribution</h3>
    <div class="chart-container">
      <canvas id="applicantChart"></canvas>
    </div>
    <div class="no-data-message" style="display: none;">No applicant data available</div>
  </div>
`;

    document.querySelector('.job-management').insertAdjacentHTML('beforeend', chartHTML);

    // Initialize chart
    setTimeout(() => {
      const ctx = document.getElementById('applicantChart');
      const noDataMessage = document.querySelector('.no-data-message');

      // Collect status data from all jobs
      const statusData = {
        applied: 0,
        reviewed: 0,
        selected: 0,
        rejected: 0
      };

      let totalApplicants = 0;

      jobs.forEach(job => {
        job.applicants.forEach(applicant => {
          statusData[applicant.status]++;
          totalApplicants++;
        });
      });

      if (totalApplicants === 0) {
        ctx.style.display = 'none';
        noDataMessage.style.display = 'block';
        return;
      }

      noDataMessage.style.display = 'none';
      ctx.style.display = 'block';

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            `Applied (${statusData.applied})`,
            `Reviewed (${statusData.reviewed})`,
            `Selected (${statusData.selected})`,
            `Rejected (${statusData.rejected})`
          ],
          datasets: [{
            data: Object.values(statusData),
            backgroundColor: [
              '#36a2eb', // blue for applied
              '#ffce56', // yellow for reviewed
              '#4bc0c0', // teal for selected
              '#ff6384'  // red for rejected
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / totalApplicants) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }, 500);
    // Add job search functionality
    const searchHTML = `
  <div class="job-search">
    <input type="text" id="companyJobSearch" placeholder="Search your job postings...">
    <button id="companySearchBtn"><i class="fas fa-search"></i></button>
  </div>
`;

    document.querySelector('.job-management').insertAdjacentHTML('afterbegin', searchHTML);

    // Add event listeners for search
    document.getElementById('companySearchBtn').addEventListener('click', filterCompanyJobs);
    document.getElementById('companyJobSearch').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') filterCompanyJobs();
    });

    function filterCompanyJobs() {
      const searchTerm = document.getElementById('companyJobSearch').value.toLowerCase();

      document.querySelectorAll('.job-card').forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const matchesSearch = title.includes(searchTerm);
        card.style.display = matchesSearch ? 'block' : 'none';
      });
    }

    // Add job status indicators
    document.querySelectorAll('.job-card').forEach(card => {
      const jobId = card.querySelector('.view-applicants').dataset.job;
      const job = jobs.find(j => j._id === jobId);

      if (job.applicants.length > 0) {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'applicant-status';

        const newApplicants = job.applicants.filter(a => a.status === 'applied').length;
        if (newApplicants > 0) {
          statusIndicator.innerHTML = `<span class="new-applicants">${newApplicants} new</span>`;
        }

        card.appendChild(statusIndicator);
      }
    });





  }







  catch (error) {
    throw error;
  }
}