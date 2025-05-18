---
layout: post
title:  "Cryptography Corner: 🔐 The Vigenère Cipher 🔐"
date:   2025-05-18
tags: cryptography
---
**GitHub**: [A C-based Implementation of the Vigenère Cipher](https://github.com/rjs3c/vigenere-cipher){:target="_blank"}.

<!--Read more-->

## Background

To skip the full background and to get straight to the Vigenère Cipher, please go [here](#introduction-to-the-vigenère-cipher).

### Cryptology, Cryptanalysis and History Primer

Suprisingly or unsurprisingly, cryptology is a field of significant fixture in history, spanning centuries and continuing to evolve in-line with technological capabilities. The earliest-known manifestation of cryptography can be found with **egyptian hyroglyphs**, an inscription technique from approxmately 3000 BC. This had adopted a **codebook** of sorts to map plaintext to (fixed) enciphered symbols.

Since the supposed much-contended, first-recorded instance of plaintext recovery in the ninth century ([UCL Article](https://www.ucl.ac.uk/news/2004/oct/hieroglyphics-cracked-1000-years-earlier-thought){:target="_blank"}), the complexity of enciphering techniques have improved greatly with the tradecraft of civilisations. This brings about the nextmost popular historical cipher, the **Caesar Cipher**, in 100 BC. This is the first-documented instance of a **substitution cipher**, wherein the characters of a given plaintext are replaced with alternate characters based upon a dynamically-decided **key**. In the context of the Caesar Cipher, the key is an integer representing the number of positions in the alphabet in which to 'shift' each plaintext character by (all of which are within the latin alphabet). This is decided ahead of tine between confidants. For instance, suppose we decide on the key <math display="inline"><mn>3</mn></mrow></math> - which can be described as **a Caesar shift of** <math display="inline"><mn>3</mn></mrow></math> or **ROT3** (shorthand for **rotate by** <math display="inline"><mn>3</mn></mrow></math>);

```
Plaintext:  | a | b | c | d | e | f | [...]
Ciphertext: | d | e | f | g | h | i | [...]
```

Here, *each character* in the plaintext - let's use ```Hello``` - is shifted right by three places to yield ```Khoor```. Conversely, to recover the original plaintext, the ciphertext can be simply shifted back by three places;

```
Ciphertext: | a | b | c | d | e | f | [...]
Plaintext:  | x | y | z | a | b | c | [...]
```

As you can see, if we break outside of the alpabetic space (beyond **Z** or before **A**), this *wraps around* either from **A** or **Z**. Mathematically, **encipherment** and **decipherment** can be expressed as follows, supposing that <math display="inline"><mi>M</mi></mrow></math> corresponds to a character of the original plaintext, <math display="inline"><mi>C</mi></mrow></math> the enciphered character, and <math display="inline"><mi>K</mi></mrow></math> the key;

<math display="block">
      <mrow>
            <mrow>
                  <mi>C</mi>
                  <mo>=</mo>
                  <mo>(</mo>
                  <mi>M</mi>
                  <mo>+</mo>
                  <mi>K</mi>
                  <mo>)</mo>
                  <mspace/>
                  <mo>mod</mo>
                  <mn>26</mn>
            </mrow>
      </mrow>
</math>

<math display="block">
      <mrow>
            <mrow>
                  <mi>M</mi>
                  <mo>=</mo>
                  <mo>(</mo>
                  <mi>C</mi>
                  <mo>- </mo>
                  <mi>K</mi>
                  <mo>)</mo>
                  <mspace/>
                  <mo>mod</mo>
                  <mn>26</mn>
            </mrow>
      </mrow>
</math>

The <math display="inline"><mi>mod</mi><mn>26</mn></mrow></math> is **modular arithmetic** that ensures that <math display="inline"><mi>C</mi></mrow></math>/<math display="inline"><mi>M</mi></mrow></math> remains *within* the alphabetic space and *wraps around*, with <math display="inline"><mn>26</mn></mrow></math> being the total length of the alphabet. In practice - at least millenia ago - this effect was achieved through a [wheel/disc](https://upload.wikimedia.org/wikipedia/commons/b/b5/CipherDisk2000.jpg){:target="_blank"}.

While trivial in modern day, this was once *possibly* used to conceal strategically and operationally-significant information for historical events including **The Gallic War**, though more primarily was adopted for private correspondence ([Ancient Cybersecurity II](https://antigonejournal.com/2021/09/cracking-caesar-cipher/){:target="_blank"}). This is **monoalphabetic** in nature, meaning that *all* plaintext characters have a fixed replacement structure - that is, with <math display="inline"><mi>K</mi><mo>=</mo><mn>3</mn></mrow></math>, **A** is *always* guaranteed to correspond to **D**, **B** to **E** and so on until a new key is decided upon. This presents concerns that, should the key be attained by adversaries, this is *always* guaranteed to decipher the ciphertext back into the original plaintext.

In spite of an unknown key to adversaries, it is also possible to employ other cryptanalytic techniques to completely compromise the cipher. Most popularly, **brute force** and **frequency analysis**. The first technique is possible given, in actuality, there only exist **26** possible keys in which to shift the ciphertext characters by - and, given all characters are shifted by the same key, it takes little time to systematically compute *all* possible plaintexts. Take the previous example ```Khoor```;

```
K = 1 -> Lipps | ✗
K = 2 -> Ifmmp | ✗
K = 3 -> Hello | ✓
```

Given how small the keyspace is, this can also be conducted by hand albeit more tedious. Mathematically, the effort or **keyspace** (that is, the set of all possible keys), can be expressed as <math display="inline"><mn>26</mn><mo>!</mo></mrow></math> (**26 factorial**), which simply covers all integers that are less than or equal to 26.

**Frequency analyis** is also feasible with the Caesar Cipher. Given the insufficient **confusion** and **diffusion**, crytographic properties representing the relationship between plaintext-ciphertext, in part or in full the plaintext can be inferred. How this is done is by inspecting ciphertext (assuming this is a **ciphertext-only** attack) for conventional language patterns. Take our previous ciphertext ```Khoor```. Note the ```oo``` here, which corresponds to the plaintext ```ll```. The double-l is one of several double-letter **digraphs** in the field of orthography alongside double-e and double-o, which we can use to limit the possible characters ```o``` can correspond to. We can look for other digraphs, which are combinations of two vowels/consonants (i.e., '-**ch**'). There are a variety of other occurrences which one could check for (namely, **bigraphs**, **diphthongs**, so forth), of which modern day tooling can readily analyse masses of text for.

We can also look for frequently-occurring characters, and correlate these to the most prominent letters in the respective alphabet. In the case of the English language, the letter **E** occurs the most among its counterparts in many texts - this is conveyed in a [2003-2004 sampling of 40,000 words by Cornell University](https://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html){:target="_blank"}. Subsequently, assumptions can be made, should the ciphertext comprise sufficient enough words/characters, about particular letters and what these actually correspond to. Take the ciphertext "```Khoor wkhuh, wklv lv flskhuwhaw surgxfhg iurp wkh Fdhvdu Flskhu```". Courtesy of [dcode.fr](https://www.dcode.fr/frequency-analysis){:target="_blank"}, the letter '```h```' has the highest (16.98%) **frequency distribution**, strongly implying this *could* be the plaintext letter '```e ```'. This is confirmed by the original ciphertext "```Hello there, this is ciphertext produced from the Caesar Cipher```".

<!-- https://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html -->

The Caesar, or ROT, Cipher in practice is highly susceptible to compromise and as such shouldn't be used in a serious capacity, as hopefully exhibited by the above cryptanalysis techniques. Woeful (past and present) adopters in the wild;

- (Most Popularly) [Netscape Navigator](https://archive.org/stream/mac_Netscape_gator_3.0_Book_Macintosh_Edition_1996/Netscape_gator_3.0_Book_Macintosh_Edition_1996_djvu.txt){:target="_blank"}
- [Fujifilm Multifunction Printers](https://www.foregenix.com/blog/dude-its-just-a-printer){:target="_blank"}

<!-- https://www.foregenix.com/blog/dude-its-just-a-printer -->
<!-- https://softwareengineering.stackexchange.com/questions/96681/where-do-you-use-rot13 -->
<!-- https://nvd.nist.gov/vuln/detail/CVE-2009-4455 -->

### Introduction to the Vigenère Cipher

OK - so why is the above relevant to the Vigenère Cipher?

The Vigenère Cipher, the name of which referencing the French-based diplomat Blaise de Vigenère but referencing primitives long-before established in [15th-century literature](https://www.historyofinformation.com/detail.php?id=1677){:target="_blank"}, is a **polyalphabetic substitution cipher**. This form of cipher, contrarily to the **monoalphabetic** kind, applies a seperate shift to *each* plaintext/ciphertext character giving each an individual replacement structure - as opposed to a single substitution applied to *all* characters. Therefore, instead of there being a possible **26** keys by which to encipher/decipher by, there exists 26 different keys for *each character*, which can be expressed as <math display="inline"><msup><mn>26</mn><mi>n</mi></msup></math> where <math><mi>n</mi></math> equals the number of letters. As described in [declassified NSA documents](https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/friedman-documents/lectures-speeches/FOLDER_019/41700479073980.pdf){:target="_blank"} and [Blaise de Vigenère's text](https://gallica.bnf.fr/ark:/12148/bpt6k73371g.image){:target="_blank"}, a **keyword** was used as a design decision for memorability. The numeric representation of the number (in the 26-letter English alphabet, **A**<math><mo>=</mo><mn>0</mn></math>, **B**<math><mo>=</mo><mn>1</mn></math>, so on) is then used to rotate/shift the plaintext or ciphertext by.

Suppose we have the plaintext "```Hello there, this is ciphertext produced from the Vigenere Cipher```" and key "```key```". Excluding punctuation, the substitution of *each* character occurs as follows;

```
Plaintext:  |  H  |  E  |  L  |  L  |  O  |  T  |  H  | [...]
Key:        |  K  |  E  |  Y  |  K  |  E  |  Y  |  K  | [...]
Key Digit:  |  10 |  4  |  24 |  10 |  4  |  24 |  10 | [...]
Ciphertext: |  R  |  I  |  J  |  V  |  S  |  R  |  R  | [...]
```

Notice that the length of the key is *exceeded* by the length of the plaintext. In cases like these, the key continues to repeat until this reaches the length of the plaintext - therefore, giving "```keykeyk...```". Similarly to the Caesar Cipher, this is mathematically expressed as follows, except where <math display="inline"><mi>n</mi></math> corresponds to the current letter;


<math display="block">
      <mrow>
            <mrow>
                  <msub>
                        <mi>C</mi>
                        <mi>n</mi>   
                  </msub>
                  <mo>=</mo>
                  <mo>(</mo>
                  <msub>
                        <mi>M</mi>
                        <mi>n</mi>   
                  </msub>
                  <mo>+</mo>
                  <msub>
                        <mi>K</mi>
                        <mi>n</mi>   
                  </msub>
                  <mo>)</mo>
                  <mspace/>
                  <mo>mod</mo>
                  <mn>26</mn>
            </mrow>
      </mrow>
</math>

<math display="block">
      <mrow>
            <mrow>
                  <msub>
                        <mi>M</mi>
                        <mi>n</mi>   
                  </msub>
                  <mo>=</mo>
                  <mo>(</mo>
                  <msub>
                        <mi>C</mi>
                        <mi>n</mi>  
                  </msub>
                  <mo>-</mo>
                  <msub>
                        <mi>K</mi>
                        <mi>n</mi>  
                  </msub>
                  <mo>)</mo>
                  <mspace/>
                  <mo>mod</mo>
                  <mn>26</mn>
            </mrow>
      </mrow>
</math>

Comparatively to its monoalphabetic counterpart, this cipher offers significant improvements in cryptographic strength, and subsequently resistence to cryptanalytic efforts. The <math display="inline"><msup><mn>26</mn><mi>n</mi></msup></math> keyspace takes *exponentially* more time to traverse and exhaust - in computational time complexity terms, this is expressed as <math display="inline"><mi>O</mi><mo>(</mo><msup><mn>26</mn><mi>k</mi></msup><mo>)</mo></math> to indicate that the practical effort grows subsantially grows even if the length of <math display="inline"><mi>K</mi></math> is simply incremented. Moreover, the previous frequency analysis techniques explored would prove ineffective given the aforementioned language patterns would be less likely to manifest consistently - even occurrences like double-o could appear as, say, '```og```' or '```az```' depending on the key.

So, at first glance it appears that the Vigenère Cipher offers **perfect secrecy** - where the ciphertext and plaintext relationship is completely unclear - at least theoretically. However, this is not always the case with one glaring susceptibility - the key length ([StackExchange](https://crypto.stackexchange.com/questions/37178/conditions-for-perfect-secrecy-with-the-vigenere-cipher#:~:text=In%20particular%2C%20to%20obtain%20perfect,for%20more%20than%20one%20message.){:target="_blank"}).

The Vigenère Cipher remained unbreakable for centuries, used in historically-significant events including the [1861-5 American Civil War](https://www.cryptomuseum.com/crypto/usa/ccd/index.htm){:target="_blank"}. The first *documented* (notwithstanding the undocumented work of [Charles Babbage](https://thonyc.wordpress.com/2013/12/26/christmas-trilogy-2013-part-ii-on-her-majestys-secret-service/){:target="_blank"}), contested, successful cryptanalytic technique for the cipher however was ascribed to Friedrich Kasiski in 1863 who, leveraging frequency analysis, could glean the length of the key used in encipherment - this is known as the [Kasiski Test](https://macs4200.org/chapters/08/3/kasiski-test){:target="_blank"}.

Now, why is ascertaining the length of the key critical to undermining the cipher's cryptographic strength? This reduces the ciphertext recovery efforts particularly in brute-forcing, in that the added iterations required for attempting arbitrary key lengths on top of exhausting each key variation of a given length is no longer neccessary. Here, only exhausting keys of a *single length* is required, thereby reducing computational overheads. This is especially prudent for large, **ciphertext-only** scenarios.

How the aforementioned Kasiski Test works is by observing the distances between repeated portions of the ciphertext - substrings of, say, a length of 3 to rule out incidental occurrences, such as ```ABC``` ([MTU](https://pages.mtu.edu/~shene/NSF-4/Tutorial/VIG/Vig-Kasiski.html){:target="_blank"}). Suppose <math display="inline"><mi>K</mi><mo>=</mo></math>"```KEY```", and <math display="inline"><mi>M</mi><mo>=</mo></math>"```THE DOG WAS THE SUSPECT ALL ALONG```" (arbitrary but beneficial for the example in terms of working with the key length). With <math display="inline"><mi>C</mi><mo>=</mo></math>"```DLC NSE GEQ DLC CYQZIAD EJV EJYRE```", we can observe clear repeats for "```DLC```", which in a **known plaintext** scenario we know deciphers to "```THE```".

Observing the procedures for the test, we calculate the physical distance between the two "```DLC```"s as <math display="inline"><mn>9</mn></math>, which the **greatest common divisor** (GCD) will provide viable key length candidates for. Given there is one number (GCD requiring two or more numbers), we can simply find the factors - <math display="inline"><mn>1</mn></math>, <math display="inline"><mn>3</mn></math> (**ah-ha**!) and <math display="inline"><mn>9</mn></math>.

While effective here and in numerous cases, this soon becomes problematic as the ciphertext message and (hopefully) key length becomes substantial - particularly if the key length reaches that of the plaintext. That said, futher analytic techniques have since been realised since to suit a variety of scenarios. Namely and popularly, the [Index of Coincidence](https://pages.mtu.edu/~shene/NSF-4/Tutorial/VIG/Vig-IOC.html){:target="_blank"} for poly/monoalphabetic substitution cipher identification (truly testing the tenets of [Kerckhoffs' Principle](https://link.springer.com/referenceworkentry/10.1007/978-1-4419-5906-5_487){:target="_blank"}), [Hill-Climbing](https://www.tandfonline.com/doi/abs/10.1080/01611194.2018.1551253){:target="_blank"} for resource **tradeoff**.

## Proof-of-Concept Compilation

**GNU/Linux using GCC**

```bash
$ gcc vigenere.c -o vigenere
$ chmod +x vigenere
$ ./vigenere
```

**On NT using the VS Developer Command Prompt**

```bash
$ cl vigenere.c
$ .\vigenere.exe
```

## Proof-of-Concept Usage

```
usage: ./vigenere [-h] "message" [-m MODE] [-k "KEY"]

positional arguments:
      message  specifies the message to encrypt/decrypt (A-Z, a-z).
      -m       encrypt/decrypt the subsequent message.
               (0 = encrypt, 1 = decrypt, 0 = default)
      -k       specifies the keyword to use (variable length, ASCII-only).

optional arguments:
      -h       displays help message and usage information.
```

<!-- https://www.historyofinformation.com/detail.php?id=1677 -->
<!-- https://ciphermysteries.com/other-ciphers/bellaso-ciphers -->
<!-- https://www.cryptomuseum.com/crypto/vigenere/ -->
<!-- https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/friedman-documents/lectures-speeches/FOLDER_019/41700479073980.pdf -->
<!-- https://crypto.stackexchange.com/questions/16141/how-to-solve-cipher-encrypted-with-vigenère-columnar-transposition -->
<!-- https://security.stackexchange.com/questions/212372/deciphering-ciphertext-with-an-unknown-key-and-algorithm -->
<!-- https://crypto.stackexchange.com/questions/24008/key-length-vs-keyspace -->
<!-- https://crypto.stackexchange.com/questions/21201/what-is-the-keyspace-of-rot-13 -->
<!-- https://crypto.interactive-maths.com/frequency-analysis-breaking-the-code.html#google_vignette -->

<!-- https://pages.mtu.edu/~shene/NSF-4/Tutorial/VIG/Vig-Kasiski.html -->

## Disclaimer

As signposted above, this is a classical cryptosystem, utilising a trivial primitive that the application of in serious context(s) is discouraged given its well-documented lack of resistence against modern computational (and even human-driven) analytical techniques. This should not be considered a crutch for ample security hygiene, and instead advice should be sought from appropriate guidelines - such as NIST's FIP-approved cryptographic algorithms ([SP 800-140Cr2](https://csrc.nist.gov/pubs/sp/800/140/c/r2/final){:target="_blank"} as of writing). As such, please do not expect this tool to meet your commercial needs; this is purely for research purposes.