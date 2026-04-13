/* ════════════════════════════════════════════
   Blog Post Data
   ════════════════════════════════════════════ */

const POSTS = {
  diffusion: {
    date: 'April 2025',
    title: 'Can we trust diffusion models? Uncertainty quantification beyond sample quality',
    body: `
      <p>Diffusion models have achieved remarkable empirical success. On standard benchmarks, models like DDPM (Ho et al., 2020), Score SDE (Song et al., 2021), and their successors produce samples of striking perceptual quality. But sample quality — as measured by FID, IS, or human preference — is a statement about the average behaviour of the generator, not about the reliability of any individual output. When these models are deployed in scientific or safety-critical settings — medical imaging, molecular design, weather forecasting — a different question becomes urgent: <em>how do we know when to trust a specific sample?</em></p>

      <p>This post attempts a careful treatment of what uncertainty quantification means in the context of diffusion models, why the standard toolkit largely fails here, and what recent theoretical work suggests about the path forward.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">1. The forward and reverse processes</h3>

      <p>Recall the setup. A diffusion model defines a forward process that gradually corrupts data <em>x</em>&#8320; ~ <em>p</em><sub>data</sub> by injecting Gaussian noise over <em>T</em> steps:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">q(x_t | x_{t-1}) = 𝒩(x_t; √(1−β_t) x_{t-1}, β_t I)

q(x_t | x_0)     = 𝒩(x_t; √ᾱ_t x_0, (1−ᾱ_t) I)

where  ᾱ_t = ∏_{s=1}^{t} (1 − β_s)</pre>

      <p>As <em>t</em> → <em>T</em>, <em>q</em>(<em>x</em><sub><em>T</em></sub>) ≈ 𝒩(0, <strong>I</strong>) regardless of the data distribution. The generative model learns to reverse this process by approximating the score function ∇<sub><em>x</em></sub> log <em>p</em>(<em>x</em><sub><em>t</em></sub>) — or equivalently the denoising direction — via a neural network <strong>ε</strong><sub>θ</sub>(<em>x</em><sub><em>t</em></sub>, <em>t</em>) trained on the objective:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">ℒ(θ) = 𝔼_{t, x_0, ε} [ ‖ε − ε_θ(√ᾱ_t x_0 + √(1−ᾱ_t) ε, t)‖² ]

where ε ~ 𝒩(0, I),  t ~ Uniform{1,…,T}</pre>

      <p>The continuous-time limit (Song et al., 2021) frames this as a stochastic differential equation. The forward SDE is:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">dx = f(x, t) dt + g(t) dW

and the reverse-time SDE (Anderson, 1982):

dx = [f(x,t) − g(t)² ∇_x log p_t(x)] dt + g(t) dW̄</pre>

      <p>where <em>W̄</em> is a reverse-time Brownian motion. The learned score function <strong>s</strong><sub>θ</sub>(<em>x</em>, <em>t</em>) ≈ ∇<sub><em>x</em></sub> log <em>p</em><sub><em>t</em></sub>(<em>x</em>) plugs into the reverse SDE to yield a sampler.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">2. Why standard UQ fails here</h3>

      <p>In classical probabilistic modelling, uncertainty in a prediction <em>ŷ</em> = <em>f</em>(<em>x</em>) decomposes into <strong>aleatoric</strong> uncertainty (irreducible noise in the data-generating process) and <strong>epistemic</strong> uncertainty (uncertainty due to limited data or model capacity). Standard Bayesian and frequentist tools — posterior predictive intervals, conformal prediction sets, bootstrap confidence intervals — target one or both of these.</p>

      <p>Diffusion models break this decomposition in at least three ways.</p>

      <p><strong>Stochasticity is in the architecture, not the likelihood.</strong> Each call to the reverse process with a fresh noise initialisation <em>x</em><sub><em>T</em></sub> ~ 𝒩(0, <strong>I</strong>) produces a different sample. This sample-to-sample variation is not a posterior over latent variables — it is the stochastic trajectory of an SDE. There is no single "prediction" <em>ŷ</em> to attach an interval to.</p>

      <p><strong>The learned score is a point estimate.</strong> Training minimises the expected squared error of the denoising direction, producing a single θ*. This θ* carries no explicit representation of its own uncertainty. Unlike a Bayesian neural network with a posterior <em>p</em>(θ | data), there is no distribution over score functions — only a fixed one. Downstream samples therefore carry no epistemic uncertainty signal from the model itself.</p>

      <p><strong>Coverage guarantees require exchangeability.</strong> Conformal prediction (Vovk et al., 2005; Angelopoulos &amp; Bates, 2023) achieves finite-sample marginal coverage:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">P(Y_{n+1} ∈ Ĉ(X_{n+1})) ≥ 1 − α</pre>

      <p>under the assumption that (X₁, Y₁), …, (Xₙ, Yₙ), (X<sub>n+1</sub>, Y<sub>n+1</sub>) are exchangeable. For a generative model conditioned on a prompt or measurement <em>y</em>, the "test point" is the new generation — not a held-out (X, Y) pair from the calibration set. Exchangeability fails unless very strong assumptions hold about the equivalence of calibration and deployment conditioning.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">3. Epistemic uncertainty via Bayesian scores</h3>

      <p>One natural response is to treat θ itself as a random variable. Franzese et al. (2023) propose Bayesian Diffusion Models, placing a prior <em>p</em>(θ) over score network weights and approximating the posterior <em>p</em>(θ | data) via variational inference. The marginal score is then:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">∇_x log p_t(x) ≈ 𝔼_{θ ~ q(θ)} [s_θ(x, t)]</pre>

      <p>and epistemic uncertainty is measured by the variance of <strong>s</strong><sub>θ</sub>(<em>x</em>, <em>t</em>) across the approximate posterior. In practice, deep ensembles (Lakshminarayanan et al., 2017) serve as a cheaper surrogate.</p>

      <p>The difficulty is theoretical: the score function ∇<sub><em>x</em></sub> log <em>p</em><sub><em>t</em></sub>(<em>x</em>) is a function of the <em>data</em> distribution, not of θ. Posterior uncertainty over θ induces uncertainty over the approximation <strong>s</strong><sub>θ</sub>, but the relationship between this and downstream sample quality is mediated by the entire trajectory of the reverse SDE — making propagation of uncertainty non-trivial.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">4. Conformal risk control for generation</h3>

      <p>A more recent line adapts conformal ideas to generation tasks by redefining the problem. Rather than asking for a prediction set around an unknown output, one asks: for a given generation <em>x̂</em>, can we certify that some measurable property <em>r</em>(<em>x̂</em>, <em>x</em>*) exceeds a threshold with high probability?</p>

      <p>Angelopoulos et al. (2022) introduce conformal risk control, replacing marginal coverage with a bound on an arbitrary monotone risk functional ℛ:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">𝔼[ℛ(Ĉ_λ(X), Y)] ≤ α

where λ is chosen by:

λ̂ = inf { λ : (1/n+1) [ Σᵢ Lᵢ(λ) + 1 ] ≤ α }</pre>

      <p>Applied to diffusion models, <em>L</em><sub><em>i</em></sub>(λ) compares a generation to a reference at threshold λ. The calibration-test split must still be exchangeable, but the target is now expected risk rather than coverage — a strictly weaker and often more natural goal for generative tasks.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">5. Posterior sampling and the inverse problem</h3>

      <p>In scientific applications — medical imaging reconstruction, seismic inversion, weather downscaling — diffusion models sample from a posterior <em>p</em>(<em>x</em> | <em>y</em>) where <em>y</em> = <strong>A</strong><em>x</em> + <em>n</em>, with <strong>A</strong> a known linear operator and <em>n</em> ~ 𝒩(0, σ²<strong>I</strong>). Chung et al. (2022) show that the posterior score decomposes as:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">∇_{x_t} log p(x_t | y) = ∇_{x_t} log p_t(x_t)
                          + ∇_{x_t} log p(y | x_t)

In the linear Gaussian case:

∇_{x_t} log p(y | x_t) ≈ −(1/σ²) Aᵀ(Aμ̂_{0|t} − y) / σ_t²

where μ̂_{0|t} = (x_t + (1−ᾱ_t) s_θ(x_t, t)) / √ᾱ_t</pre>

      <p>The first term is the unconditional score; the second is a data-consistency gradient. Running this modified reverse process yields approximate posterior samples. Boys et al. (2023) show that the approximation error accumulates along the reverse trajectory and can produce systematic bias in the tails of the approximate posterior — precisely the region most relevant for UQ.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">6. Score estimation error and its propagation</h3>

      <p>The theoretical core of the trustworthiness question: how does error in the learned score function propagate to the distribution of generated samples? De Bortoli (2022) proves that under mild regularity conditions:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">TV(p_data, p_θ)² ≤ C · [ε_score · T + δ_disc(T, Δt)]

where ε_score = 𝔼_t [ ‖s_θ(·,t) − ∇ log p_t(·)‖²_{L²(p_t)} ]
and   δ_disc  is the SDE solver discretisation error</pre>

      <p>Two consequences follow immediately. First, distribution-level error is controlled by the <em>integrated</em> score error across all noise levels — a single badly approximated timestep contaminates the whole trajectory. Second, discretisation error <em>δ</em><sub>disc</sub> — O(Δ<em>t</em>) or O(Δ<em>t</em>²) depending on the solver — compounds with score error and cannot be separated from it in practice.</p>

      <p>Chen et al. (2022) sharpen this in the log-Sobolev and Poincaré inequality regime, obtaining KL divergence bounds that depend polynomially on dimension <em>d</em>. The dimension dependence is a fundamental obstacle for UQ: the same score network that produces sharp-looking images in <em>d</em> = 10⁶ may have distribution-level error that is very large in total variation — it simply concentrates in low-probability regions that FID doesn't measure.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">7. Calibration via simulation-based diagnostics</h3>

      <p>Given that individual samples cannot carry interval estimates, a natural reframing is: can we calibrate the <em>ensemble</em> of samples? For posterior sampling tasks, calibration means the empirical distribution of <em>K</em> samples should approximate the true posterior — in particular, marginal coverage should hold:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">P(x* ∈ CR_α({x̂^(k)})) ≈ 1 − α

where CR_α is the α-credible region of the empirical distribution</pre>

      <p>Simulation-based calibration (SBC; Talts et al., 2018) provides a diagnostic: if <em>p</em><sub>θ</sub>(· | <em>y</em>) = <em>p</em>(· | <em>y</em>), then the rank of the true <em>x</em>* within the samples should be uniformly distributed. Deviations from uniformity diagnose specific failure modes — under-dispersed posteriors (overconfidence), over-dispersed posteriors (excessive hedging), or biased posteriors (systematic drift).</p>

      <p>Gao et al. (2023) apply SBC to diffusion-based posterior samplers for MRI reconstruction and find consistent under-dispersion: the true image falls near the high-density region of the sample ensemble, meaning the model is more confident than it should be about fine-grained structure. This is exactly the failure mode that matters clinically.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">8. Open problems</h3>

      <p><strong>Non-asymptotic sample complexity for score estimation.</strong> How many samples are needed to learn a score function with ε-error in <em>L</em>²(<em>p</em><sub><em>t</em></sub>) for all <em>t</em>? Existing results (Oko et al., 2023) handle specific function classes but the gap between these and transformer-parameterised score networks remains large.</p>

      <p><strong>Error accumulation along the reverse trajectory.</strong> A bound on score error at each step says little about the distribution of the final sample unless error accumulation is controlled tightly across thousands of steps. This is an open problem in the analysis of SDEs with approximated drifts.</p>

      <p><strong>Classifier-free guidance and coverage.</strong> Guidance mixes conditional and unconditional scores with weight <em>w</em>:</p>

      <pre style="background:var(--bg-subtle);border:1px solid var(--border);padding:1rem 1.25rem;border-radius:2px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0;">s̃_θ(x_t, t, c) = (1+w) s_θ(x_t, t, c) − w s_θ(x_t, t, ∅)</pre>

      <p>Increasing <em>w</em> improves sample quality at the cost of diversity — a fidelity-diversity tradeoff with no principled UQ interpretation. What increasing <em>w</em> implies for coverage properties of conditional samples is, as far as I can tell, open.</p>

      <p><strong>Post-hoc recalibration.</strong> Even if a diffusion posterior sampler is miscalibrated, can we recalibrate it post-hoc — analogously to temperature scaling for classifiers — without retraining? The challenge is that the "temperature" of a diffusion model is distributed across every step of the reverse process, not a single scalar at the output.</p>

      <h3 style="font-size:1.15rem;font-weight:500;margin:2rem 0 0.75rem;">References</h3>
      <p style="font-size:0.85rem;color:var(--fg-muted);line-height:1.8;">
        Anderson, B.D.O. (1982). Reverse-time diffusion equation models. <em>Stochastic Processes and their Applications</em>, 12(3), 313–326.<br/>
        Angelopoulos, A.N. &amp; Bates, S. (2023). Conformal prediction: A gentle introduction. <em>Foundations and Trends in Machine Learning</em>, 16(4).<br/>
        Angelopoulos, A.N., Bates, S., Fisch, A., Lei, L., &amp; Schuster, T. (2022). Conformal risk control. <em>ICLR 2023</em>.<br/>
        Boys, B., Girolami, M., Pidstrigach, J., Reich, S., Mosca, A., &amp; Akyildiz, O.D. (2023). Tweedie moment projected diffusions for inverse problems. <em>arXiv:2310.06721</em>.<br/>
        Chen, S., Chewi, S., Li, J., Li, Y., Salim, A., &amp; Zhang, A. (2022). Sampling is as easy as learning the score. <em>arXiv:2209.11215</em>.<br/>
        Chung, H., Kim, J., Mccann, M.T., Klasky, M.L., &amp; Ye, J.C. (2022). Diffusion posterior sampling for general noisy inverse problems. <em>ICLR 2023</em>.<br/>
        De Bortoli, V. (2022). Convergence of denoising diffusion models under the manifold hypothesis. <em>arXiv:2208.05314</em>.<br/>
        Franzese, G. et al. (2023). How much is enough? A study on diffusion times in score-based generative models. <em>arXiv:2206.05173</em>.<br/>
        Gao, Y., Mishne, G., &amp; Sulam, J. (2023). Posterior sampling with denoising diffusion models for inverse problems in medical imaging. <em>arXiv:2307.16978</em>.<br/>
        Ho, J., Jain, A., &amp; Abbeel, P. (2020). Denoising diffusion probabilistic models. <em>NeurIPS 2020</em>.<br/>
        Ho, J. &amp; Salimans, T. (2022). Classifier-free diffusion guidance. <em>NeurIPS 2022 Workshop</em>.<br/>
        Lakshminarayanan, B., Pritzel, A., &amp; Blundell, C. (2017). Simple and scalable predictive uncertainty estimation using deep ensembles. <em>NeurIPS 2017</em>.<br/>
        Oko, K., Akiyama, S., &amp; Suzuki, T. (2023). Diffusion models are minimax optimal distribution estimators. <em>ICML 2023</em>.<br/>
        Song, Y. et al. (2021). Score-based generative modeling through stochastic differential equations. <em>ICLR 2021</em>.<br/>
        Talts, S., Betancourt, M., Simpson, D., Vehtari, A., &amp; Gelman, A. (2018). Validating Bayesian inference algorithms with simulation-based calibration. <em>arXiv:1804.06788</em>.<br/>
        Vovk, V., Gammerman, A., &amp; Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.
      </p>
    `
  }
};