def compute_mgf(F, p, N):
    """
    Computes a moment generating function (MGF) and its first two derivatives.
    
    Given:
      - F: threshold distribution function; typically F(x) is defined for x in [0,1]
      - p: a function that returns the probability p(k) of having k neighbors
      - N: maximum number of neighbors
      
    Returns:
      A tuple (G0, G1, G2):
        G0: The value of the MGF.
        G1: The first derivative of the MGF.
        G2: The second derivative of the MGF.
        
    The computation follows:
      
      G0 = 0
      G1 = 0
      G2 = 0
      for k = 0 to N:
          if k <= 0 then:
              rhok = 1
          else:
              rhok = F(1/k)
          sk = rhok * p(k)
          G0 = G0 + sk
          G1 = G1 + k * sk
          G2 = G2 + k * (k-1) * sk
      
      return (G0, G1, G2)
    """
    G0 = 0.0  # MGF value
    G1 = 0.0  # MGF derivative value
    G2 = 0.0  # MGF second derivative value

    for k in range(0, N + 1):
        if k <= 0:
            rhok = 1.0
        else:
            rhok = F(1.0 / k)
        sk = rhok * p(k)
        G0 += sk
        G1 += k * sk
        G2 += k * (k - 1) * sk

    return G0, G1, G2 